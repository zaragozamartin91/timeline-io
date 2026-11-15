# DSL


```php

# Comments are single lined and defined using Hash

# Statements end with semi-colon
# This is an empty statement
;

# Starting point statement
@("2026-10-30");

# right arrow statement
->;

# left arrow statement
<-;

# long right arrow statement
-->;

# longer right arrow statement
--->;

# longest right arrow statement
---->;

# the semi-colon can be placed far away from the dsl body
<---   ;

# timeline extend statement
| ;

# Meta / macro statement start with $
# The example below changes the fill color of the svg shapes to brown.
$fill="brown";

# right arrow with message on top
# ^("<some message>") defines the top message to place on the arrow.
->^("top message");

# right arrow with message on bottom
# _("<some message>") defines the bottom message to place on the arrow.
->_("bottom message");

# right arrow with both message on top and on the bottom
->^("another top message")_("one more bottom message");

# Long arrow pointing to a box
# ["<some text>"] defines a box to which the arrow points to
-->["this is a box"];


```
