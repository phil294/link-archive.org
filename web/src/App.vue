<template lang="slm">
# :_='
section#app.column.fill-h
	popup if=authenticate_popup @close=hide_authenticate_popup
		authenticate @authenticated=hide_authenticate_popup
	modal if=loading_counter
		.box.padding-l
			| Loading... ($loading_counter)
	header.center.padding
		nav
			router-link exact to=/ [LOGO]
			router-link exact to=/settings Settings
			router-link exact to=/p search result
		div#login_status if=is_logged_in
			| Logged in as 
			span if=session.name $session.name
			span else-if=session.email $session.email
			span else-if=session.external_type $session.external_identifier [$session.external_type]
			button.btn @click=logout Logout
		button.btn if=!is_logged_in @click=show_authenticate_popup
			| Sign in
	main.flex-fill.column
			router-view
# '
</template>

<script lang="coffee">
import { mapState, mapGetters, mapActions } from 'vuex'

export default
	name: 'App'
	computed: {
		...mapState
			-	'app_name'
			-	'loading_counter'
			-	'authenticate_popup'
		...mapState 'session',
			-	'session'
		...mapGetters 'session',
			-	'is_logged_in'
	}
	methods: {
		...mapActions
			-	'hide_authenticate_popup'
			-	'show_authenticate_popup'
		...mapActions 'session',
			-	'logout'
	}
</script>

<style lang="stylus" scoped>
#app > header
	border-bottom: 1px solid lightgrey
	justify-content: space-between
nav > a
	white-space: nowrap
	margin-right:10%
nav > a.router-link-active
	font-weight: bold
main
	overflow: auto // FF
</style>

<style lang="stylus">

// SAKURA /////////////////////////

/* Sakura.css v1.0.0
 * ================
 * Minimal css theme.
 * Project: https://github.com/oxalorg/sakura
		MIT License

		Copyright (c) 2016 Mitesh Shah

		Permission is hereby granted, free of charge, to any person obtaining a copy
		of this software and associated documentation files (the "Software"), to deal
		in the Software without restriction, including without limitation the rights
		to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
		copies of the Software, and to permit persons to whom the Software is
		furnished to do so, subject to the following conditions:

		The above copyright notice and this permission notice shall be included in all
		copies or substantial portions of the Software.

		THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
		IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
		FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
		AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
		LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
		OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
		SOFTWARE.
 */

// @import 'https://fonts.googleapis.com/css?family=Fira+Mono|Noto+Serif|Noto+Sans:300,400,500';

:root {
	--color-main: #d8d8d8;
	--color-foreground: #444;
	--color-hover: #c4c4c4;
	--color-disabled: #a6a6a6;
	--color-highlighted: darkorange;
	--color-border: var(--color-hover);
}

/* Body */
html {
	font-family: "Noto Serif", "Arial", "Helvetica", sans-serif;
}

body {
	color: var(--color-foreground);
	background-color: #fff;
}

/* todo
@media (max-width: 684px) {
	body {
		font-size: 1.53rem; } }

@media (max-width: 382px) {
	body {
		font-size: 1.35rem; } }
*/

h1, h2, h3, h4, h5, h6 {
//	line-height: 1.1;
//	font-family: Verdana, Geneva, sans-serif;
	font-weight: bold;
	overflow-wrap: break-word;
	word-wrap: break-word;
	-ms-word-break: break-all;
	word-break: break-word;
	-ms-hyphens: auto;
	-moz-hyphens: auto;
	-webkit-hyphens: auto;
	hyphens: auto;
	margin: initial; }

small, sub, sup {
	font-size: 75%; }

a {
	text-decoration: none;
	color: var(--color-foreground); }
	a:hover {
		color: var(--color-hover);
		border-bottom: 2px solid var(--color-border); }

blockquote {
	font-style: italic;
	margin-left: 1.5em;
	padding-left: 1em;
	border-left: 3px solid var(--color-main); }

img {
	max-width: 100%; }

/* Pre and Code */
pre {
	background-color: #f1f1f1;
	display: block;
	padding: 1em;
	overflow-x: auto; }

code {
	font-size: 0.9em;
	padding: 0 0.5em;
	background-color: #f1f1f1;
	white-space: pre-wrap; }

pre > code {
	padding: 0;
	background-color: transparent;
	white-space: pre; }

textarea {
	width: 100%; }

button // buttons, by default, should not have any specific styling so they can be used better semantically. for typical button-buttons, use .btn-
	-webkit-appearance: none
	background: initial
	border: initial
	padding: initial
	color: inherit // FF bug

button, input[type="submit"], input[type="reset"], input[type="button"], label
	cursor: pointer

.button[disabled], button[disabled], input[type="submit"][disabled], input[type="reset"][disabled], input[type="button"][disabled] {
	cursor: default;
	opacity: .5;
}
// TODO: .btn = button-like styling, should not be used as button identifier
.btn, input[type="submit"], input[type="reset"], input[type="button"] {
	display: inline-block;
	padding: 2px 6px;
	text-align: center;
	text-decoration: none;
	white-space: nowrap;
	background-color: var(--color-main);
	color: var(--color-foreground);
	border-radius: 1px;
	border: 1px solid var(--color-border);
	box-sizing: border-box; }
	.btn:hover, input[type="submit"]:hover, input[type="reset"]:hover, input[type="button"]:hover {
		background-color: var(--color-hover);
		border-color: var(--color-hover);
		// color: #f9f9f9;
		outline: 0; }

textarea, select, input {
	color: #4a4a4a;
	padding: 6px 10px;
	/* The 6px vertically centers text on FF, ignored by Webkit */
	background-color: #f1f1f1;
	border: 1px solid #f1f1f1;
	border-radius: 4px;
	box-shadow: none;
	box-sizing: border-box; }
	textarea:focus, select:focus, input[type]:focus {
		border: 1px solid var(--color-border);
		outline: 0; }

input[type="checkbox"]:focus {
	outline: 1px dotted var(--color-border); }

legend, label {
	display: inline-block;
}
legend {
	font-weight: 600; }


// GLOBAL ///////////////////////// 

body, html {
	padding: 0;
	margin: 0;
	width: 100%;
	height: 100%;
}
form
	input:not([type=checkbox]), label, select {
		width: 100%;
	}
input[type=checkbox] + label {
	display: inline;
}
a {
	cursor: pointer;
}
fieldset {
	border: 2px solid #eeeeee; // TODO: breaks .box in login, also has border or shadow or both
}
details > summary {
	cursor: pointer;
}
[draggable] { // TODO: == true or wat, wrong on readonly
	cursor: move;
}

// CLASSES /////////////////////////

.padding
	padding: 0.5vw
.padding-l
	padding: 1vw
.padding-xl
	padding: 3vw
.margin
	margin: 0.5vw
.margin-l
	margin: 1vw
.margin-xl
	margin: 3vw
.note
	font-size:80%
	opacity:0.8
@keyframes fadein
	from {opacity: 0}
	to {opacity: 1}
// works with v-if etc.
.fade-in
	animation: fadein 0.5s
.fade-toggle
	transition: opacity 0.5s
// does not work with v-if, keeps size, but enables fade out animation. use like: ... class=fade-toggle :class.hidden=_var_
.fade-toggle.hidden
	opacity: 0
.disabled // todo rename inactive or similar
	color: var(--color-disabled)
.highlighted
	color: var(--color-highlighted)
.error
	color: darkred // css4 @apply fade-in
.small
	font-size: 80%
.flex-base
	display: flex
	min-height: 0
	min-width: 0
.flex
	@extend .flex-base
	@media screen and (max-width: 600px) {
		flex-direction: column
	}
.flex-fill
	flex: 1
.column
	@extend .flex-base
	flex-direction: column
.row
	@extend .flex-base
	flex-direction: row
.justify-center
	@extend .flex-base
	justify-content: center
.align-center
	@extend .flex-base
	align-items: center
.center
	@extend .justify-center, .align-center
.fill-w
	width: 100%
.fill-h
	height: 100%
.fill
	@extend .fill-w, .fill-h
.box
	// box-shadow: 1px 2px 7px 1px #eee
	box-shadow: 1px 1px 1px 1px #ddd
	// border: 1px solid #ddd
	background: rgba(255,255,255,0.88)
</style>