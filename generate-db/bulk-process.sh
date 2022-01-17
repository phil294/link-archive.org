#!/bin/bash
set -e

run() {
    echo "Run: " "$@" >&2
    local start=$(date +%s.%N)
    "$@"
    local end=$(date +%s.%N)
    local runtime=$(echo "$end - $start" |bc -l)
    echo "Finished in $runtime: " "$@" >&2
}

db="db.db"

exit 6 # safe check to not accidentally remove the db
rm "$db" ||:
sqlite3 "$db" < db-init.sql

if ! [ -f wat.paths ]; then
    echo "download paths index..." >&2
    curl -Ss -L 'https://commoncrawl.s3.amazonaws.com/crawl-data/CC-MAIN-2021-43/wat.paths.gz' \
        | gzip -d \
        > wat.paths
fi

: ''
cat wat.paths | while readarray -tn 3 batch && ((${#batch[@]})); do
    for line in "${batch[@]}"; do
        (
            filename=tmpi/$(basename "$line")
            if ! [ -f "$filename.wat.gz" ]; then
                run curl -Ss -L "https://commoncrawl.s3.amazonaws.com/${line}" > "$filename.wat.gz"
            fi
            if ! [ -f "$filename.wat" ]; then
                run gzip -d > "$filename.wat" <"$filename.wat.gz"
            fi
        ) &
    done
    wait
    for filename in tmpi/*.wat.gz.wat; do
        run ./process-wat "$db" "$filename" 48
        # ./process-wat "file" "2017-13" 44 # "2021-43"
    done
    rm -f tmpi/*
done
# rm tmpi/*
# '




echo fin