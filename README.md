# tmpl.js

A tiny trivial javascript template ... library?

## Usage

	<script src="tmpl.js"></script>


### Defining templates

    <div template="login" id="login" class="login">
        <span>Welcome {{user}}!</span>
    </div>

### Rendering templates

	tmpl.load()
	tmpl('login',{'username':'Bob'})	
	==>
	<div id="login" class="login">
        <span>Welcome Bob!</span>
    </div>

## Installation

	bower install tmpl.js

…or grab it [raw](https://raw.github.com/asbjornenge/tmpl.js/master/tmpl.js).