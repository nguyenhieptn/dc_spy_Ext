<?php
$out = shell_exec( 'git reset --hard;git pull 2>&1' );
echo '<pre>'.$out.'</pre>';
