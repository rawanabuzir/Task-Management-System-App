<?php


Function securityinput ($strinput){


return htmlspecialchars(strip_tags($_POST[$strinput]));


}



