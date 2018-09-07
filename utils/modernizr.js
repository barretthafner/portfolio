/**
 * @overview Browsernizr
 *
 * @description
 * Import (and initiate) app-wide tests.
 *
 * @author ljd
 */
// Shim HTML5
import 'browsernizr/lib/html5shiv';

// Misc test
import 'browsernizr/test/audio';
import 'browsernizr/test/canvas';
import 'browsernizr/test/css/calc';
import 'browsernizr/test/css/flexbox';
import 'browsernizr/test/css/multiplebgs';
import 'browsernizr/test/css/pointerevents';
import 'browsernizr/test/css/transforms3d';
import 'browsernizr/test/touchevents';
import 'browsernizr/test/crypto/getrandomvalues';

// Initialize and export
import Modernizr from 'browsernizr';

export default Modernizr;
