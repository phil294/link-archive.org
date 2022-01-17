package main

import (
	"bufio"
	"database/sql"
	"fmt"
	"html"
	"log"
	"net/url"
	"os"
	"strconv"
	"strings"
	"unicode"
	"unicode/utf8"

	"golang.org/x/text/transform"
	"golang.org/x/text/unicode/norm"

	_ "github.com/mattn/go-sqlite3"
)

// Accurately get the value for the *first* occurrence of json key `key` in json_str.
// However, any nesting is ignored. Quotes are handled appropriately.
func get_rugged_json_value(json_str string, key string) string {
	pos := strings.Index(json_str, `"`+key+`":"`)
	if pos < 0 {
		return ""
	}
	var sb strings.Builder
	quote := '"'
	backslash := '\\'
	escape := false
	for i := pos + len(key) + 4; ; i++ {
		char := rune(json_str[i])
		if escape {
			escape = false
		} else {
			if char == backslash {
				escape = true
			} else if char == quote {
				break
			}
		}
		sb.WriteByte(json_str[i])
	}
	return sb.String()
}

func decode_uri(uri string) string {
	decoded, err := url.QueryUnescape(uri)
	if err != nil {
		return uri
	}
	return strings.TrimSpace(decoded)
}

// slow
func remove_accents(str string) string {
	isMn := func(r rune) bool {
		return unicode.Is(unicode.Mn, r)
	}
	result, _, err := transform.String(transform.Chain(norm.NFD, transform.RemoveFunc(isMn), norm.NFC), str)
	if err != nil {
		result = str
	}
	return result
}

func remove_non_ascii(str string) string {
	var sb strings.Builder
	backslash := '\\'
	escape := false
	spaced := false
	alpha := false
	for i := 0; i < len(str); i++ {
		char := rune(str[i])
		if escape {
			escape = false
		} else {
			if char == backslash {
				escape = true
			} else {
				if char >= 48 && char < 58 {
					// 0-9
					spaced = false
					sb.WriteByte(str[i])
				} else if char >= 65 && char < 91 || char >= 97 && char < 123 {
					// A-Z a-z
					alpha = true
					spaced = false
					sb.WriteByte(str[i])
				} else {
					// Anything, including space, dot, cyrillic etc. - replace with space (max 1)
					if !spaced {
						sb.WriteByte(32)
					}
					spaced = true
				}
			}
		}
	}
	if !alpha {
		return ""
	}
	return strings.TrimSpace(sb.String())
}

func main() {

	if len(os.Args) < 4 {
		log.Fatal("invalid script invocation")
	}
	watfile := os.Args[2]
	start_offset, _ := strconv.Atoi(os.Args[3])

	db_path := os.Args[1]

	log.SetPrefix(watfile + " ")

	file, err := os.Open(watfile)
	if err != nil {
		log.Fatal(err)
	}
	defer file.Close()

	db, _ := sql.Open("sqlite3", db_path+"?_fk=1")
	defer db.Close()

	scanner := bufio.NewScanner(file)
	const max_line_length = 10000000
	buf := make([]byte, max_line_length)
	scanner.Buffer(buf, max_line_length)

	for i := 0; i < start_offset; i++ {
		scanner.Scan()
	}

	tx, err := db.Begin()

	i := -1
	c_unique_urls := 0

	// No checks for duplicates! (todo, if more dumps ever to be included)
	stmt, _ := tx.Prepare("insert into fts (site, title) values (?, ?)")

	for scanner.Scan() {
		i++
		if i%33 == 0 {
			c_unique_urls++

			uri_json := scanner.Text()

			uri := get_rugged_json_value(uri_json, "WARC-Target-URI")
			uri = decode_uri(uri)
			if len(uri) > 195 {
				uri = uri[:195]
			}

			bloats := []string{"https://www.", "http://www.", "https://", "http://"}
			is_bloated := false
			for _, bloat := range bloats {
				if strings.HasPrefix(uri, bloat) {
					// This saves about 7.3 % db size
					uri = uri[len(bloat):]
					is_bloated = true
					break
				}
			}
			if !is_bloated {
				log.Fatalf("uri empty or not-http at line %d: %s", i+start_offset+1, uri)
			}

			if uri[len(uri)-1] == '/' {
				// This saves about 0.1 % db size
				uri = uri[:len(uri)-1]
			}

			title := get_rugged_json_value(uri_json, "Title")
			// title = remove_non_ascii(title)
			// title = remove_accents(title)
			title = html.UnescapeString(title)
			if len(title) < 3 {
				continue
			}

			// // This saves 0.32 % db size. Pbly not really worth the extra handling in frontend and potential bugs.
			// uri_split := strings.Split(uri, "/")
			// last_uri_split := uri_split[len(uri_split)-1]
			// uri_title := strings.ReplaceAll(strings.ReplaceAll(last_uri_split, "_", " "), "-", " ")
			// uri_title = strings.TrimSpace(uri_title)
			// if strings.ToLower(title) == strings.ToLower(uri_title) {
			// 	title = ""
			// }

			if len(title) > 130 {
				title = title[:130]
			}

			if !utf8.ValidString(title) || !utf8.ValidString(uri) {
				continue
			}

			_, err = stmt.Exec(uri, title)
			if err != nil {
				log.Fatal(err)
			}
			if false {
				fmt.Println(title)
			}
		}

	}
	log.Println(i, c_unique_urls)

	tx.Commit()
	stmt.Close()

	if err := scanner.Err(); err != nil {
		log.Fatal(err)
	}

	if c_unique_urls < 40000 {
		log.Fatalf("c_unique_urls < 40,000: %d", c_unique_urls)
	}
}
