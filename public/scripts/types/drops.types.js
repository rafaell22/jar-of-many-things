// @ts-check
import {DROP_TYPE} from "../classes/Drop";
import {RANDOM_DISTRIBUTION} from "../utils/math";

/**
 * @typedef {object} DropsConfig
 *
 * @property {DROP_TYPE} type
 * @property {object} diameter
 * @property {number} diameter.min
 * @property {number} diameter.max
 * @property {RANDOM_DISTRIBUTION} distribution 
 * @property {object} image
 * @property {number} image.x
 * @property {number} image.y
 * @property {number} image.w
 * @property {number} image.h
 * @property {string} image.src
 * @property {boolean} recoverDrops
 * @property {boolean} mergeDrops
 *
 */

/**
 * @typedef {object} DropData
 *
 * @property {string} color
 * @property {number} [diameter]
 * @property {object} [dropPoint]
 * @property {number} dropPoint.x
 * @property {number} dropPoint.y
 * @property {number} [maxRadius]
 * @property {number} [retries]
 * @property {string} [username]
 */
