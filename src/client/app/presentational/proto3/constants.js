/**
 * @overview Constants
 */



// Setup

/**
 * @const
 * Show statistics
 */
export const SHOW_STATS = true;



// Cloud settings

/**
 * @const
 * Cloud rotation
 */
export const ALPHA_CLOUD_X_ROTATION_SPEED = 0.01;
export const ALPHA_CLOUD_Y_ROTATION_SPEED = 0.03;
export const ALPHA_CLOUD_Z_ROTATION_SPEED = 0.01;
export const BETA_CLOUD_X_ROTATION_SPEED = 0.01;
export const BETA_CLOUD_Y_ROTATION_SPEED = 0.02;
export const BETA_CLOUD_Z_ROTATION_SPEED = 0.01;

/**
 * @const
 * Cloud size
 */
export const CLOUD_INNER_RADIUS = 500;
export const CLOUD_OUTER_RADIUS = 600;

/**
 * @const
 * Camera position related to the cloud.
 * Sets how far the camera is away from origin. CLOUD_Z refers to how it looks. Since the cloud is centered on the origin it will be that distance from the camera. If you set it to 0 the camera will be inside the cloud, if you set it to more than FRUSTRUM_REAR the cloud won’t appear because it will be too far away
 */
export const CLOUD_Z = CLOUD_OUTER_RADIUS * 2;



// Fog / Background settings

/**
 * @const
 * Fog / bg color
 */
export const BACKGROUND_COLOR = 0x1e1e1e;

/**
 * @const
 * Fog size
 */
export const FOG_START = CLOUD_OUTER_RADIUS * 1.5;
export const FOG_END = CLOUD_OUTER_RADIUS * 3;



// Points

/**
 * @const
 * Friction/damping applied to point velocity. Has to be between 0 and 1. The higher the number, the more friction is applied.
 */
export const POINT_FRICTION_AWAY = 0.15;
export const POINT_FRICTION_HOME = 0.5;

/**
 * @const
 * Point force (base acceleration speed). Has to be between 0 and 1. The higher the number, the faster the points will react.
 */
export const POINT_FORCE = 0.02;

/**
 * @const
 * Point count. Number of points of each type to create.
 */
export const NUM_POINTS = 2000;

/**
 * @const
 * Amount of purple points related to grey.
 */
export const ALPHA_POINTS_RATIO = 2;

/**
 * @const
 * Point size
 */
export const POINT_SIZE = 4;

/**
 * @const
 * Point colors
 */
export const ALPHA_POINTS_COLOR = 0x6251f3;
export const BETA_POINTS_COLOR = 0x838383;



/**
 * @const
 * Selection shell and sphere
 */
export const HELPER_MESH_OPACITY = 0;

export const SELECTION_SCALAR_MODIFIER = 0.5;
export const SELECTION_SHELL_COLOR = 0x6698CB;
export const SELECTION_SHELL_RADIUS = CLOUD_OUTER_RADIUS;
export const SELECTION_SPHERE_COLOR = 0xF66717;
export const SELECTION_SPHERE_DEPTH = 1;
export const SELECTION_SPHERE_RADIUS = CLOUD_OUTER_RADIUS - CLOUD_INNER_RADIUS;

/**
 * @const
 * Back of the rendering area - the farthest point that something will get rendered
 */
export const FRUSTUM_REAR = FOG_END;

