/**
 * Internal dependencies
 */
// import HelpTab from './help';
// import ProSettings from './pro-extension';
// import RecommendedTab from './recomended';
// import StarterTab from './starter';
// import Sidebar from './sidebar';
// import CustomizerLinks from './customizer';
// import Notices from './notices';
function kadenceTryParseJSON(jsonString){
    try {
        var o = JSON.parse(jsonString);

        // Handle non-exception-throwing cases:
        // Neither JSON.parse(false) or JSON.parse(1234) throw errors, hence the type-checking,
        // but... JSON.parse(null) returns null, and typeof null === "object", 
        // so we must check for that, too. Thankfully, null is falsey, so this suffices:
        if (o && typeof o === "object") {
            return o;
        }
    }
    catch (e) { }

    return false;
};
import map from 'lodash/map';
import LazyLoad from 'react-lazy-load';
import KadenceImporterFullPreview from './full-preview-mode.js'
import KadenceSubscribeForm from './subscribe-form'
/**
 * WordPress dependencies
 */
const { __, sprintf } = wp.i18n;
const { Fragment, Component, render, PureComponent } = wp.element;
const { Modal, Spinner, ButtonGroup, Dropdown, Icon, Button, ExternalLink, ToolbarGroup, CheckboxControl, TextControl, ToggleControl, MenuItem, Tooltip, PanelBody } = wp.components;
import {
	arrowLeft,
	download,
	update,
	chevronLeft,
	chevronDown,
} from '@wordpress/icons';
const cIcon = <svg
xmlns="http://www.w3.org/2000/svg"
width="24"
height="24"
viewBox="0 0 24 24"
>
<path d="M15.984 18v2.016H8.015V18h7.969zM11.016 7.969v8.016h1.969V7.969h3l-3.984-3.984-3.984 3.984h3z"></path>
</svg>;
const eIcon = <svg
xmlns="http://www.w3.org/2000/svg"
fillRule="evenodd"
strokeLinejoin="round"
strokeMiterlimit="2"
clipRule="evenodd"
viewBox="0 0 180 180"
>
<circle cx="90.03" cy="89.952" r="90" fill="url(#_Linear1)"></circle>
<path fill="#fff" d="M50 50H66.003V130H50z"></path>
<path fill="#fff" d="M82 50H130.011V66H82z"></path>
<path fill="#fff" d="M82 82H130.011V98H82z"></path>
<path fill="#fff" d="M82 114.046H130.011V130.046H82z"></path>
<defs>
  <linearGradient
	id="_Linear1"
	x1="0"
	x2="1"
	y1="0"
	y2="0"
	gradientTransform="rotate(-52.456 186.056 40.829) scale(178.658)"
	gradientUnits="userSpaceOnUse"
  >
	<stop offset="0" stopColor="#372b73"></stop>
	<stop offset="1" stopColor="#e9335e"></stop>
  </linearGradient>
</defs>
</svg>;
const eIconNew = <svg
xmlns="http://www.w3.org/2000/svg"
fillRule="evenodd"
strokeLinejoin="round"
strokeMiterlimit="2"
clipRule="evenodd"
viewBox="0 0 180 180"
>
<circle cx="90.03" cy="89.952" r="90" fill="#93003c"></circle>
<path fill="#ff5bd4" d="M50 50H66.003V130H50z"></path>
<path fill="#ff5bd4" d="M82 50H130.011V66H82z"></path>
<path fill="#ff5bd4" d="M82 82H130.011V98H82z"></path>
<path fill="#ff5bd4" d="M82 114.046H130.011V130.046H82z"></path>
</svg>;
const gbIcon = <svg
xmlns="http://www.w3.org/2000/svg"
x="0"
y="0"
enableBackground="new 0 0 720 864"
viewBox="0 0 720 864"
className="gblogo"
>
<g>
  <path
	d="M432.4 415.6c-2.5-1.7-5.9-1-7.6 1.5-9.9 14.9-30.9 15.7-32 15.7h-.5c-25.9 0-35.8 22.1-36.2 23-1.2 2.8.1 6 2.8 7.2.7.3 1.5.5 2.2.5 2.1 0 4.1-1.2 5-3.3.1-.2 6.9-15.4 24.4-16.4v28.3c-.7 6.1-3.6 10.9-8.7 14.5-5.3 3.7-12.4 5.6-21.1 5.6-10.4 0-18.9-3.6-25.2-10.7-6.4-7.1-9.6-17.2-9.6-30.2l.1-31.2c.5-11.5 3.6-20.6 9.5-27.1 6.4-7.1 14.8-10.7 25.2-10.7 8.7 0 15.8 1.9 21.1 5.6 5.3 3.7 8.3 8.8 8.8 15.4v.7c0 3.8 3.1 6.9 6.9 6.9s6.9-3.1 6.9-6.9v-.7c-1-9.9-5.5-17.7-13.6-23.6-8.1-5.9-18.2-8.8-30.4-8.8-14.5 0-26.2 4.8-35.1 14.3-8.4 8.9-12.8 20.6-13.3 35 0 1-.1 2-.1 3l.1 28.1h-.1c0 15.9 4.5 28.6 13.4 38.1s20.6 14.3 35.1 14.3c12.2 0 22.3-2.9 30.4-8.8 7.4-5.4 11.8-12.5 13.3-21.3l.3-31.4c9.1-2.2 21.5-7.2 29.3-19 2-2.5 1.3-5.9-1.3-7.6zM528.7 94.1h76.7c3.4 0 6.2-2.8 6.2-6.2s-2.8-6.2-6.2-6.2h-76.7c-3.4 0-6.2 2.8-6.2 6.2s2.8 6.2 6.2 6.2zM117.8 94.1h76.7c3.4 0 6.2-2.8 6.2-6.2s-2.8-6.2-6.2-6.2h-76.7c-3.4 0-6.2 2.8-6.2 6.2s2.7 6.2 6.2 6.2z"
	className="st2"
  ></path>
  <circle cx="609.3" cy="150.1" r="6.2" className="st2"></circle>
  <circle cx="359.8" cy="130.6" r="6.2" className="st2"></circle>
  <path
	d="M244.8 150.2h.3c23.3 0 33.7-14.6 41.6-28.2 2.6-4.5 12.2-19.5 25.8-23.4 16.8-4.9 34.7 2.9 41.7 18.2 1 2.2 3.2 3.5 5.4 3.6h.7c2.2-.1 4.4-1.4 5.4-3.6 7-15.3 24.9-23.1 41.7-18.2 13.6 4 23.2 18.9 25.8 23.4 7.9 13.7 18.3 28.2 41.9 28.2 14.2 0 31-10.6 35.7-30.9 3.9-16.8-3.3-32-19-39.7-3.1-1.5-6.8-.3-8.3 2.8-1.5 3.1-.3 6.8 2.8 8.3 14.9 7.4 13.6 20.5 12.4 25.8-2.4 10.4-11.6 21.4-23.7 21.4-15.5 0-22.9-7.8-31.2-22.1-4.1-7-15.5-24-33-29.1-19.1-5.6-39.3 1.1-50.9 15.8-11.6-14.7-31.8-21.4-50.9-15.8-17.5 5.1-28.9 22.1-33 29.1-8.3 14.3-15.7 22.1-30.9 22.1h-.2c-13.2-.1-21.6-9.3-24-18.4-1.2-4.3-3.7-19 13.1-29 2.9-1.7 3.9-5.5 2.1-8.5-1.8-2.9-5.5-3.9-8.5-2.1-19.3 11.5-22.3 29.7-18.7 42.9 4.4 16.3 18.9 27.3 35.9 27.4z"
	className="st2"
  ></path>
  <path d="M360 734L360.1 734 360.1 734 360 734z" className="st2"></path>
  <circle cx="108.1" cy="150.1" r="6.2" className="st2"></circle>
  <circle cx="90.7" cy="88" r="6.2" className="st2"></circle>
  <circle cx="631.3" cy="88" r="6.2" className="st2"></circle>
  <circle cx="664.5" cy="485.3" r="6.2" className="st2"></circle>
  <circle cx="639.6" cy="627.1" r="6.2" className="st2"></circle>
  <circle cx="599.8" cy="644.8" r="6.2" className="st2"></circle>
  <path
	d="M231.9 111.2c0 9.2 7.5 16.7 16.7 16.7s16.7-7.5 16.7-16.7-7.5-16.7-16.7-16.7c-9.2-.1-16.7 7.4-16.7 16.7zm16.7-4.4c2.4 0 4.4 2 4.4 4.4 0 2.4-2 4.4-4.4 4.4-2.4 0-4.4-2-4.4-4.4 0-2.4 2-4.4 4.4-4.4zM473.6 127.9c9.2 0 16.7-7.5 16.7-16.7s-7.5-16.7-16.7-16.7-16.7 7.5-16.7 16.7 7.5 16.7 16.7 16.7zm0-21.1c2.4 0 4.4 2 4.4 4.4 0 2.4-2 4.4-4.4 4.4-2.4 0-4.4-2-4.4-4.4 0-2.4 2-4.4 4.4-4.4zM376.7 121.6c-3.2 1.2-4.8 4.7-3.6 7.9 1.2 3.2 4.7 4.8 7.9 3.7 1-.4 25-8.4 43.4 20.2 1.2 1.8 3.2 2.8 5.2 2.8 1.1 0 2.3-.3 3.3-1 2.9-1.8 3.7-5.7 1.9-8.5-19.2-29.7-46.4-29.4-58.1-25.1zM343.3 121.6c-.9-.3-9.1-3.2-20.3-1.5-10.4 1.5-25.3 7.4-37.7 26.7-1.8 2.9-1 6.7 1.9 8.5 1 .7 2.2 1 3.3 1 2 0 4-1 5.2-2.8 18.3-28.6 42.3-20.6 43.4-20.2 3.2 1.2 6.7-.5 7.9-3.7 1.2-3.2-.5-6.8-3.7-8zM627.8 138.5l30.1-34.2v49.3c0 3.4 2.8 6.2 6.2 6.2s6.2-2.8 6.2-6.2V88c0-2.6-1.6-4.9-4-5.8-2.4-.9-5.1-.2-6.8 1.7l-40.9 46.5c-2.3 2.6-2 6.5.6 8.7 2.4 2.3 6.3 2 8.6-.6zM56.8 159.9c3.4 0 6.2-2.8 6.2-6.2v-49.3l30.1 34.2c2.3 2.6 6.2 2.8 8.7.6 2.6-2.3 2.8-6.2.6-8.7L61.5 83.9c-1.7-1.9-4.4-2.6-6.8-1.7-2.4.9-4 3.2-4 5.8v65.7c0 3.4 2.7 6.2 6.1 6.2zM493.4 166c-2.9-.2-5.6 1.8-6.3 4.6-.7 2.9.7 5.9 3.3 7.1 9.8 4.6 18.7 6.4 26.7 6.4 15.3 0 27.5-6.7 36-13.7 13.6-11.2 20.6-25.3 20.9-25.9 1.4-2.9.4-6.4-2.4-8-6.3-3.7-17.2-6-33.8 4.1-8.3 5.1-14.7 11.2-15.8 12.3-15.2 13.4-27.9 13.1-28.6 13.1zm36.9-3.9l.3-.3c4.7-4.7 18-15.6 28.4-16.1-3 4.3-7.5 10.1-13.6 15.2-9 7.4-18.6 11-28.8 10.8 4.2-2.2 8.9-5.4 13.7-9.6zM151.4 136.5c-2.8 1.6-3.8 5.1-2.4 8 .3.6 7.3 14.7 20.9 25.9 8.5 7 20.6 13.7 36 13.7 8.1 0 17-1.8 26.7-6.4 2.7-1.3 4-4.2 3.3-7.1-.7-2.9-3.3-4.8-6.3-4.7-.5 0-13.3.4-28.5-13-1.1-1.1-7.5-7.2-15.8-12.3-16.6-10-27.6-7.7-33.9-4.1zm41.4 25.6c4.7 4.2 9.4 7.3 13.7 9.6-21.6.2-35.9-16.3-42.4-26 10.4.5 23.7 11.4 28.4 16.1l.3.3z"
	className="st2"
  ></path>
  <path
	d="M671.8 664.6c-6.2-5.2-13-8.2-19.3-9.9 2.4-1.8 4.7-3.9 6.7-6.2 15.3-18 15.4-44.5.2-61.7-2.3-2.6-6.2-2.8-8.7-.5-2.6 2.3-2.8 6.2-.5 8.7 11.1 12.6 10.9 32.1-.4 45.5-9.2 10.8-26.7 13.4-31.9 14-15.7 1.7-33.3 5.3-42.8 26.8-1.5 3.3-2.4 7-2.6 11-2.2-.7-4.6-1.1-7-1.1-12.5 0-22.7 10.2-22.7 22.7 0 8.6 4.8 16.1 11.9 19.9-2.1 1.9-4.1 4-5.9 6.4-21-28.3-54.6-46.1-91.6-46.1-5.3 0-10.6.4-15.7 1.1 30.4-9.3 58.7-23.8 84.5-43 33.3-24.9 61-57.4 80-93.9 20-38.4 30.1-79.9 30.1-123.1v-.8-.2-.3c-.2-35.1-8-66.7-19.1-93.9 4.1.8 8 1.1 11.5 1.1 25.9 0 37.3-17.8 38.5-19.9 5.6-9.4 6.5-20.8 3.3-31.1.1-.3.1-.7.1-1.1V176.3c0-3.4-2.8-6.2-6.2-6.2s-6.2 2.8-6.2 6.2V271c-10.5-9.1-25.7-10.1-32-10.1-12.2.1-19.8-1.8-25.4-11.4-4.7-8.1-2-16.5 2.7-21.3 5.9-6 14.3-6.8 22.5-2.3 3 1.6 6.8.6 8.4-2.4 1.6-3 .6-6.8-2.4-8.4-13-7.2-27.6-5.4-37.3 4.4-9.6 9.8-11.4 24.3-4.6 36.1 8.9 15.3 22.4 17.5 35.7 17.5h.5c4 0 16.9.6 24.3 7.6 9.6 9.1 12.1 23.4 5.8 34 0 0-.1.1-.1.2-.5.9-12.4 21.1-45.6 10.5-10-21.2-21.6-39.2-32.4-53.6l-4.9 3.7 4.9-3.8-2-2.6c-21.3-35.7 3.3-73.7 16.1-89.8l7.2-8.2c2.2-2.6 2-6.5-.6-8.7-2.5-2.1-6.1-2-8.4.3-.2.2-1.3 1.3-3 3.2-11.1 11.3-54.5 51.3-96.6 30.4l-1.2-.8-.6-.4c-37.7-20.3-74.9-32-110.4-35-4.6-10.5-10.7-18.5-18.4-18.5-7.8 0-13.9 8.1-18.6 18.8-49.7 2.2-111.5 34.3-114.1 35.6-42.3 21.3-85.9-18.9-97-30.2-1.7-1.9-2.9-3-3-3.2-2.3-2.3-5.9-2.4-8.4-.3-2.6 2.2-2.8 6.1-.6 8.7l7.7 8.7c4.5 5.6 10.2 13.7 15 23.4 12 24.3 12.2 46.4.7 65.8-14.3 17.8-25.9 36.5-34.8 56.2-33.5 10.9-45.5-9.5-46-10.4 0-.1-.1-.1-.1-.2-6.3-10.6-3.8-24.9 5.8-34 7.4-7 20.3-7.6 24.3-7.6h.1c13.4 0 27.2-2.1 36.1-17.5 6.8-11.8 5-26.4-4.6-36.1-9.7-9.9-24.3-11.6-37.3-4.4-3 1.6-4.1 5.4-2.4 8.4 1.6 3 5.4 4.1 8.4 2.4 8.3-4.5 16.7-3.7 22.5 2.3 4.7 4.8 7.3 13.2 2.7 21.3-5.5 9.5-13 11.4-25 11.4h-.4c-5.5 0-18.3.8-28.5 7.4v-90.3c0-3.4-2.8-6.2-6.2-6.2s-6.2 2.8-6.2 6.2v104c-6.8 12.2-7.2 27.1-.2 39.1.7 1.3 5 8.5 14.6 13.9 5.5 3.1 13.4 6 23.9 6 3.8 0 8-.4 12.5-1.3-10.8 29-16.2 60.2-16.4 94.2v1.1c0 61.4 21.6 121.7 60.8 169.8 34.7 42.6 81.9 74.2 134.2 90.3-5.5-.8-11.1-1.2-16.7-1.2-36.7 0-70 17.5-91 45.4-1.7-2.2-3.6-4.3-5.7-6.1 6.6-4 11.1-11.2 11.1-19.5 0-12.5-10.2-22.7-22.7-22.7-2.3 0-4.5.4-6.6 1-.3-3.9-1.2-7.6-2.6-10.9-9.6-21.5-27.1-25.1-42.8-26.8-5.2-.6-22.7-3.2-31.9-14-11.6-13.1-11.8-32.6-.7-45.2 2.3-2.6 2-6.5-.5-8.7-2.6-2.3-6.5-2-8.7.5-15.1 17.2-15 43.7.2 61.7 2 2.4 4.3 4.4 6.7 6.2-6.3 1.7-13.1 4.8-19.3 9.9-14.7 12.1-22.2 32.3-22.4 59.8-.5 2.5.6 5.1 2.8 6.5 1 .6 2.1.9 3.2.9.4 0 .9-.1 1.3-.2h.1c.2 0 .3-.1.5-.2.3-.1.7-.2 1-.4.1 0 .1-.1.2-.1 1-.6 1.9-1.4 2.5-2.4 2.4-3.1 12.3-7 20.5-8.7 32.1-7 38.8-28.7 37.8-39.1-.3-3.4-3.3-5.9-6.7-5.6-3.4.3-5.9 3.3-5.6 6.7 0 .1.1 1.9-.5 4.6-1.5 6.2-7 16.9-27.6 21.4h-.2c-2.4.5-9.6 2.2-16.3 5.3 1.8-17.8 7.5-30.8 17.2-38.9 14.9-12.4 34.6-8.9 34.8-8.8.7.1 1.3.1 1.9 0 3.3.7 6.1 1.1 8.2 1.3 16.5 1.8 26.6 5.4 32.9 19.5 4.9 11.1-1.4 23.9-9.9 30.3-4.3 3.3-15.8 9.8-28.7-.8-2.6-2.2-6.5-1.8-8.7.8-2.2 2.6-1.8 6.5.8 8.7 5.8 4.8 12.3 7.6 19 8.4-8.6 7-14.4 15.8-17 20.4-8.4 14.5-15.2 22.3-26.5 22.4V733c0-3.4-2.8-6.2-6.2-6.2s-6.2 2.8-6.2 6.2v50.2c0 2.5 1.5 4.6 3.6 5.6 1.1.8 2.4 1.4 3.8 1.4h144c2.2 0 4-1.1 5.2-2.8.8-.8 1.5-1.8 1.8-3 5.7-22.1 25.6-37.5 48.4-37.5 20.4 0 38.5 12.4 46.2 30.9h-13.2c-5.4-13.3-18.4-22.2-33.1-22.2-16.1 0-30.3 10.9-34.6 26.4-.9 3.3 1.1 6.7 4.3 7.6 3.3.9 6.7-1.1 7.6-4.3 2.8-10.2 12.1-17.3 22.6-17.3 7.8 0 14.8 3.8 19.1 9.8h-3.6c-3.4 0-6.2 2.8-6.2 6.2 0 3.4 2.8 6.2 6.2 6.2h12.5c.2 0 .5.1.7.1.3 0 .6 0 .8-.1h24.8c3.4 0 6.2-2.8 6.2-6.2 0-.3 0-.6-.1-.9.1-.8.1-1.7-.1-2.6-7.3-27.1-32.1-46-60.2-46-27.2 0-51.1 17.6-59.4 43.3h-32.3c2.6-8.3 6.1-16 10.5-23.2.3-.4.5-.8.8-1.2 18.3-28.7 50.3-47.1 85.8-47.1 21 0 41.2 6.4 58.3 18.4.5.3 1 .6 1.5.7 2.6 3.1 5.2 6.4 7.7 9.8.6.8 1.1 1.6 1.7 2.4-.6 12.7 6.3 26 20.6 39.6.5 1.5 1 2.8 1.3 3.8v1.3c0 3.4 2.8 6.2 6.2 6.2 2.9 0 5.2-1.9 5.9-4.6 0-.1.9-3.1 2.7-8.1 12.9-12.6 19.3-24.9 19.2-36.8.8-1.2 1.7-2.5 2.6-3.7 2.8-3.8 5.7-7.5 8.7-11 17-11.8 36.9-18 57.7-18 44.8 0 84 29.2 97 71.5h-32.3c-8.2-25.7-32.1-43.3-59.4-43.3-28.1 0-52.8 18.9-60.2 46-.3 1-.3 2 0 3v.5c0 3.4 2.8 6.2 6.2 6.2h54.2c3.4 0 6.2-2.8 6.2-6.2 0-3.4-2.8-6.2-6.2-6.2h-19.7c4.3-6 11.3-9.8 19.1-9.8 10.7 0 20 7.2 22.7 17.6.7 2.8 3.2 4.6 6 4.6.5 0 1-.1 1.5-.2 3.3-.8 5.3-4.2 4.5-7.5-4.1-15.8-18.3-26.9-34.7-26.9-14.6 0-27.6 8.9-33.1 22.2h-12.5c7.6-18.5 25.8-30.9 46.2-30.9 22.8 0 42.7 15.4 48.4 37.5.1.5.4 1 .6 1.5.8 2.5 3.1 4.3 5.9 4.3H664c3.4 0 6.2-2.8 6.2-6.2v-.4-1.6c.1-.6.1-1.2.1-1.8 0-.1 0-.2-.1-.3V733c0-3.4-2.8-6.2-6.2-6.2s-6.2 2.8-6.2 6.2v42c-10.4-.8-16.9-8.5-24.9-22.3-2.6-4.4-8-12.7-16-19.5 5.5-1.2 10.8-3.8 15.7-7.9 2.6-2.2 3-6.1.8-8.7-2.2-2.6-6.1-3-8.7-.8-12.8 10.6-24.3 4.1-28.7.8-8.5-6.4-14.8-19.3-9.9-30.3 6.3-14.1 16.4-17.8 32.9-19.5 2.1-.2 4.9-.6 8.2-1.3.6.1 1.3.1 2 0 .2 0 19.7-3.6 34.7 8.8 9.8 8.1 15.6 21.1 17.3 39-6.8-3.2-14.1-4.9-16.4-5.4h-.2c-20.5-4.5-26.1-15.1-27.6-21.3-.6-2.6-.6-4.4-.5-4.6.3-3.4-2.2-6.4-5.6-6.7-3.4-.3-6.4 2.2-6.7 5.6-1 10.5 5.7 32.1 37.9 39.1 8.3 1.8 18.8 5.9 20.7 9 0 0 0 .1.1.1.3.4.6.8.9 1.1.1.1.2.1.3.2.3.2.6.5.9.6.1.1.3.2.4.2.3.2.6.3.9.4.1 0 .3.1.4.1.4.1.9.2 1.4.2.4 0 .7 0 1.1-.1.1 0 .2 0 .3-.1.3-.1.6-.2 1-.3h.1c.3-.1.5-.3.8-.4l.1-.1c.2-.1.4-.3.5-.4.1-.1.3-.2.4-.4l.4-.4c.1-.2.3-.3.4-.5.1-.2.2-.3.3-.5.1-.2.2-.3.3-.5.1-.2.1-.4.2-.6.1-.2.1-.4.2-.6 0-.2.1-.4.1-.5 0-.2.1-.4.1-.7v-.1c-.1-28.3-7.7-48.8-22.6-61.1zM152.9 777.7H87.8c5.5-5.6 9.4-12.3 12.4-17.5 2.6-4.5 12.2-19.5 25.8-23.4 16-4.7 31 .8 38.4 13.5-4.9 8.5-8.8 17.7-11.5 27.4zm1.7-53.7c-5.7 0-10.3-4.6-10.3-10.3 0-5.7 4.6-10.3 10.3-10.3s10.3 4.6 10.3 10.3c0 5.7-4.7 10.3-10.3 10.3zm366.6-78.1l.9 1.1-.9-1.1zm.2-6.2c-58.4-6.8-100.6 18.3-125.8 40.5-10.9 9.6-19.5 19.5-26 27.9-1.2-.8-2.3-1.6-3.3-2.1v-17.6c47.3-47.5 94.3-61.7 125.5-65.2 20.7-2.3 37.4-.4 47.4 1.5-5.7 5.3-11.6 10.3-17.8 15zm73.3-87.2c-6 11.5-12.9 22.5-20.5 33.1-7.9-2.5-17.8-4.8-29.7-5.9 26.5-33.6 43.3-73.7 48.7-116 8.6-1 20.5-4.7 29.6-10.6-2.4 34.7-11.8 68.1-28.1 99.4zm-42.1-111.6l7.2-.3c2.4 10.7 10.5 19.3 21.1 22.2-5.6 42.8-23.4 83.2-51.8 116.2-13.7 0-29.6 1.6-47.6 5.5 42-34.2 69.4-85.7 71.1-143.6zm-117.5 158c-4 1.6-6.8 2.9-8.2 3.5-16.6 6.6-34.4 10.9-53 12.3l165.9-165.9c-5 66.8-46.6 123.4-104.7 150.1zm188.3-164.7c-.2 5.6-15.5 14.7-29 16.9-1.9.3-3.8.5-5.6.5-2.4 0-4.7-.5-6.8-1.4-6.3-2.7-10.7-8.9-10.7-16.1 0-7.2 4.4-13.4 10.7-16.1 2.1-.9 4.4-1.4 6.8-1.4 1.8 0 3.7.2 5.6.5 13.5 2.2 28.7 11.3 29 16.8v.3zM565.5 276l2.6 3.5c22.7 30.3 49.3 77.2 54.4 135.6-9-5.8-20.8-9.5-29.3-10.5-6.4-50.6-28.9-96.3-62.2-131.6 1.4-2.9 2.2-6.2 2.2-9.6 0-4.6-1.4-8.9-3.7-12.4l28.4-32.4c-5.4 20.6-2.8 40.1 7.6 57.4zm-82.9-70.1l1.3.9.7.4c9.9 5 20.5 7.5 31.5 7.5 11.6 0 23.7-2.8 35.9-8.4l-32 36.5c-2.9-1.4-6.1-2.1-9.6-2.1-4.5 0-8.6 1.3-12.1 3.5-31.5-23-68.8-38.3-109.4-43.3-1-7.3-3-17.7-6-27.9 32.1 3.6 65.6 14.6 99.7 32.9zm38.2 57.5c0 4.5-3 8.4-7.1 9.8-1 .3-2.1.5-3.2.5h-1c-4.6-.4-8.3-3.9-9.1-8.3-.1-.6-.2-1.3-.2-1.9 0-.7.1-1.3.2-2 .9-4.5 4.7-8 9.4-8.3H511.1c4.6.3 8.5 3.6 9.5 8 .1.6.2 1.1.2 1.7-.1.1 0 .3 0 .5zm-131.4-49.9c37.2 4.9 71.6 19.1 100.7 40.1-1.5 3-2.3 6.3-2.3 9.9 0 4.5 1.3 8.6 3.6 12.2l-49.8 56.8c-2.3 2.6-2 6.5.6 8.7 1.2 1 2.6 1.5 4.1 1.5 1.7 0 3.4-.7 4.7-2.1l49.7-56.7c3 1.5 6.3 2.3 9.9 2.3 4.6 0 8.8-1.4 12.3-3.7 31 33.2 51.9 75.8 58.1 123-10.7 3-19 11.8-21.2 22.8l-7.1.3c-1.5-45.7-19.2-89.3-50.1-123.2-2.3-2.5-6.2-2.7-8.7-.4-2.5 2.3-2.7 6.2-.4 8.7 27.2 29.8 43.4 67.6 46.5 107.6L473.5 355c-2.4-2.4-6.3-2.4-8.7 0-2.4 2.4-2.4 6.3 0 8.7l71.4 71.4-176 176-176-176 70.8-70.8c2.4-2.4 2.4-6.3 0-8.7-2.4-2.4-6.3-2.4-8.7 0l-65.7 65.7c3.5-45.5 23.9-86.4 55-116.2l31 35.4c1.2 1.4 2.9 2.1 4.7 2.1 1.4 0 2.9-.5 4.1-1.5 2.6-2.3 2.8-6.2.6-8.7l-31.1-35.5c28-23.4 63.1-38.5 101.6-41.4l-52.8 52.3c-2.4 2.4-2.4 6.3 0 8.7 1.2 1.2 2.8 1.8 4.4 1.8 1.6 0 3.1-.6 4.4-1.8l58-57.4 56.3 56.3c2.4 2.4 6.3 2.4 8.7 0 2.4-2.4 2.4-6.3 0-8.7l-51.2-51.2c31.7 2.4 61.9 13 88.2 31.1 2.8 1.9 6.7 1.2 8.6-1.6 1.9-2.8 1.2-6.7-1.6-8.6-30.4-20.9-65.8-32.5-102.8-33.6v-4.4c11.6-2.8 20.9-12.7 22.7-24.9zm-180.7 74.3c3.5 0 6.8-.8 9.7-2.2l8.9 10.2c-35.3 33.7-57.8 80.6-59.6 132.7l-5-.3c-2.4-11.7-11.5-20.9-23.2-23.3 6.1-46.3 26.5-88.1 56.5-120.9 3.7 2.4 8 3.8 12.7 3.8zm-10.3-22.6c0-.5 0-.9.1-1.4 0-.3.1-.5.1-.8.9-4.4 4.7-7.8 9.3-8.1h.7c4.7 0 8.7 3.2 9.9 7.6.2.9.4 1.8.4 2.7 0 .7-.1 1.4-.2 2.1-.9 4.4-4.7 7.8-9.3 8.1h-.8c-1.3 0-2.6-.3-3.7-.7-3.7-1.4-6.5-5.2-6.5-9.5zm-35.8 175.4l5.1.3c1.7 58 29.2 109.6 71.3 143.8-18.1-4-34-5.6-47.8-5.7-28.2-32.9-46.1-73.1-51.7-115.7 11.5-2.4 20.6-11.3 23.1-22.7zm17.9 8.2l165.9 165.9C258 608 187.2 537.2 180.5 448.8zm162.7-249c2.7-18.7 11.9-43.7 16.7-45.7 5.5 2.1 14 28 16.6 45.6.5 3.5.8 6.7.8 9.3 0 1.1-.1 2.1-.3 3.1-1.5 8.1-8.6 14.3-17.2 14.3s-15.7-6.2-17.2-14.3c-.2-1-.3-2.1-.3-3.1.1-2.7.4-5.8.9-9.2zm10.8 38.5v4.3c-44.6 1.4-85.4 18.1-117.4 44.9l-8.8-10.1c2.3-3.5 3.7-7.8 3.7-12.3 0-3.8-1-7.4-2.6-10.5 29.3-21.5 64-36 101.7-41.1 1.7 12.4 11.2 22.4 23.4 24.8zm-152.7-23.6c11 0 21.6-2.5 31.6-7.5.6-.3 57.7-30 103.9-34-3 10.1-5 20.6-6 27.8-41.1 5.1-79 21-110.7 44.6-3.4-2-7.2-3.1-11.4-3.1-3.5 0-6.8.8-9.7 2.2l-33.6-38.3c12.3 5.5 24.3 8.3 35.9 8.3zm-49.9 61.9l.5-.7c10.4-17.2 13-36.8 7.8-57.4l30 34.3c-2.3 3.5-3.7 7.8-3.7 12.3 0 3.3.7 6.4 2 9.3-32.7 35.2-54.7 80.4-61 130.4-8.9 1.4-20.7 5.2-29.6 10.9 3.5-52.8 21.2-98.5 54-139.1zM96.9 434c.2-5.8 16.3-13.8 29-16.4 2.8-.6 5.4-.9 7.6-.9 1.7 0 3.2.2 4.8.7 7.3 2.1 12.7 8.8 12.7 16.8s-5.4 14.7-12.7 16.8c-1.5.4-3.1.7-4.8.7-2.3 0-4.9-.3-7.6-.9-12.7-2.7-28.8-10.7-29-16.5v-.3zm.6 18.4c8.9 5.8 20.8 9.6 29.6 11 5.3 42.4 22.1 82.6 48.7 116.2-11.9 1.1-21.8 3.3-29.8 5.8-28.7-39.4-45.3-84.9-48.5-133zM154.9 597c-.3-.4-.6-.7-.9-1.1 30.1-8.3 63-3.9 86.1 1.6 27.9 6.7 48.3 16.4 48.5 16.5l.1-.2c22.1 8.8 46.2 13.7 71.4 13.7 25.1 0 49.1-4.8 71.1-13.6l.6-.3c2.6-1.1 5.3-2.2 7.8-3.4 8.5-3.5 22.8-8.7 40-12.8 23.3-5.6 56.3-10 86.4-1.6-5.2 6.4-10.6 12.5-16.4 18.4-8.4-2.3-29.8-6.7-58.7-3.6-31.4 3.4-77.6 16.8-124.8 60.4v-10.9c0-3.4-2.8-6.2-6.2-6.2s-6.2 2.8-6.2 6.2v10.3c-46.9-43.1-92.9-56.4-124.1-59.8-29.6-3.2-51.3 1.6-59.2 3.8-5.2-5.4-10.5-11.3-15.5-17.4zm26.3 27.8c10-2 26.9-4 48-1.6 55.5 6.2 98.1 37.9 124.8 64.5v18.1c-.9.5-1.9 1.1-3 1.9-6.5-8.3-15-18-25.7-27.4-25.2-22.3-67.6-47.5-126.2-40.5v.1c-6.2-4.8-12.2-9.8-17.9-15.1zm155.3 98c-11.7-15-24.5-26.3-37.3-34.8l.1-.3c-.3-.1-.6-.2-.9-.2-21.3-13.9-42.7-20-59.9-22.5-8.1-4.2-16.1-8.9-23.8-14 37.7-1.1 71.9 11.7 102.1 38.2 10.4 9.1 18.6 18.5 24.8 26.6-1.9 2.1-3.6 4.4-5.1 7zm29.9 37.5c-1.5 1.8-3.1 3.6-4.9 5.4-.4.4-.9.9-1.4 1.3l-.1.1-.1.1v-.2c-.2-.2-.5-.4-.7-.7-2-1.9-3.7-3.8-5.3-5.7-7.3-8.7-10.5-16.8-9.4-24.2.1-.6.2-1.2.4-1.8.8-3.2 2.3-6 4.1-8.4 1.5-2 3.2-3.7 4.9-5.2 1.5-1.3 3-2.4 4.3-3.3.6-.4 1.1-.7 1.6-1 0 0 .1 0 .1-.1h.1c.7.4 1.4.9 2.3 1.5 1.2.8 2.6 1.9 4 3.1 1.8 1.6 3.6 3.5 5.1 5.6 1.8 2.6 3.3 5.5 3.9 8.8 0 .2.1.5.2.7 1.1 7.3-2 15.3-9.1 24zm24.4-45.1c-.2.2-.4.4-.5.6-2.3 2.6-4.4 5.2-6.3 7.7-1.5-2.6-3.2-5-5-7.1 6.2-8.1 14.6-17.8 25.2-27.1 30-26.4 64.1-39.2 101.5-38.3-7.8 5.1-15.8 9.9-24 14.1-42.8 6.5-72.1 28.7-90.9 50.1zm174.5-11.8c5.7 0 10.3 4.6 10.3 10.3 0 5.7-4.6 10.3-10.3 10.3s-10.3-4.6-10.3-10.3c0-5.6 4.6-10.3 10.3-10.3zm31.2 32.1c13.6 4 23.2 18.9 25.8 23.4 3.2 5.6 7.5 13 13.8 18.8H567c-2.6-9.4-6.3-18.3-11-26.5 7.6-13.6 24.6-20.4 40.5-15.7z"
	className="st2"
  ></path>
  <path
	d="M69.6 301.1c0 10.1 8.2 18.4 18.4 18.4s18.4-8.2 18.4-18.4c0-10.1-8.2-18.4-18.4-18.4s-18.4 8.3-18.4 18.4zm24.4 0c0 3.3-2.7 6-6 6s-6-2.7-6-6 2.7-6 6-6 6 2.7 6 6zM648.7 301.1c0-10.1-8.2-18.4-18.4-18.4-10.1 0-18.4 8.2-18.4 18.4 0 10.1 8.2 18.4 18.4 18.4s18.4-8.2 18.4-18.4zm-24.4 0c0-3.3 2.7-6 6-6s6 2.7 6 6-2.7 6-6 6c-3.3.1-6-2.6-6-6zM666.4 346.9c-2.3-.9-5-.4-6.8 1.4-8.1 8.3-21.4 8-21.6 8h-.2c-3.3 0-6 2.6-6.2 5.9-.1 3.4 2.5 6.3 5.9 6.4.6 0 10.4.3 20.4-4.3v100.9c0 3.4 2.8 6.2 6.2 6.2s6.2-2.8 6.2-6.2V352.6c-.1-2.5-1.6-4.8-3.9-5.7zM55.7 471.4c3.4 0 6.2-2.8 6.2-6.2V364.3c10 4.6 19.8 4.3 20.4 4.3 3.4-.1 6.1-3 5.9-6.4-.1-3.4-3-6.1-6.4-5.9-.1 0-13.5.3-21.6-8-1.8-1.8-4.4-2.3-6.8-1.4-2.3.9-3.8 3.2-3.8 5.7v112.7c-.1 3.4 2.7 6.1 6.1 6.1zM671.3 574.3c0-3.4-2.8-6.2-6.2-6.2h-40c-3.4 0-6.2 2.8-6.2 6.2s2.8 6.2 6.2 6.2h40c3.4 0 6.2-2.7 6.2-6.2zM629.8 598c3.4 0 6.2-2.8 6.2-6.2s-2.8-6.2-6.2-6.2h-15.4c-3.4 0-6.2 2.8-6.2 6.2s2.8 6.2 6.2 6.2h15.4zM644.8 609.4c0-3.4-2.8-6.2-6.2-6.2h-38.2c-3.4 0-6.2 2.8-6.2 6.2s2.8 6.2 6.2 6.2h38.2c3.4 0 6.2-2.7 6.2-6.2zM620.6 627.1c0-3.4-2.8-6.2-6.2-6.2h-29.9c-3.4 0-6.2 2.8-6.2 6.2s2.8 6.2 6.2 6.2h29.9c3.4 0 6.2-2.8 6.2-6.2zM565.1 638.6c-3.4 0-6.2 2.8-6.2 6.2s2.8 6.2 6.2 6.2h17c3.4 0 6.2-2.8 6.2-6.2s-2.8-6.2-6.2-6.2h-17zM665.1 532.8h-22.3c-3.4 0-6.2 2.8-6.2 6.2s2.8 6.2 6.2 6.2h22.3c3.4 0 6.2-2.8 6.2-6.2s-2.8-6.2-6.2-6.2zM665.1 550.5H634c-3.4 0-6.2 2.8-6.2 6.2s2.8 6.2 6.2 6.2h31.1c3.4 0 6.2-2.8 6.2-6.2s-2.8-6.2-6.2-6.2zM665.1 497.5h-9.9c-3.4 0-6.2 2.8-6.2 6.2 0 3.4 2.8 6.2 6.2 6.2h9.9c3.4 0 6.2-2.8 6.2-6.2 0-3.4-2.8-6.2-6.2-6.2zM665.1 515.2h-15.2c-3.4 0-6.2 2.8-6.2 6.2s2.8 6.2 6.2 6.2h15.2c3.4 0 6.2-2.8 6.2-6.2s-2.8-6.2-6.2-6.2z"
	className="st2"
  ></path>
  <circle cx="55.5" cy="485.6" r="6.2" className="st2"></circle>
  <circle cx="80.5" cy="627.3" r="6.2" className="st2"></circle>
  <circle cx="120.3" cy="645" r="6.2" className="st2"></circle>
  <path
	d="M54.9 580.7h40c3.4 0 6.2-2.8 6.2-6.2 0-3.4-2.8-6.2-6.2-6.2h-40c-3.4 0-6.2 2.8-6.2 6.2 0 3.5 2.8 6.2 6.2 6.2zM105.6 585.9H90.2c-3.4 0-6.2 2.8-6.2 6.2 0 3.4 2.8 6.2 6.2 6.2h15.4c3.4 0 6.2-2.8 6.2-6.2 0-3.4-2.8-6.2-6.2-6.2zM119.6 603.5H81.4c-3.4 0-6.2 2.8-6.2 6.2 0 3.4 2.8 6.2 6.2 6.2h38.2c3.4 0 6.2-2.8 6.2-6.2 0-3.5-2.8-6.2-6.2-6.2zM135.5 621.1h-29.9c-3.4 0-6.2 2.8-6.2 6.2 0 3.4 2.8 6.2 6.2 6.2h29.9c3.4 0 6.2-2.8 6.2-6.2 0-3.4-2.8-6.2-6.2-6.2zM131.7 645c0 3.4 2.8 6.2 6.2 6.2h17c3.4 0 6.2-2.8 6.2-6.2 0-3.4-2.8-6.2-6.2-6.2h-17c-3.4 0-6.2 2.8-6.2 6.2zM54.9 545.4h22.3c3.4 0 6.2-2.8 6.2-6.2 0-3.4-2.8-6.2-6.2-6.2H54.9c-3.4 0-6.2 2.8-6.2 6.2 0 3.4 2.8 6.2 6.2 6.2zM54.9 563.1H86c3.4 0 6.2-2.8 6.2-6.2 0-3.4-2.8-6.2-6.2-6.2H54.9c-3.4 0-6.2 2.8-6.2 6.2 0 3.4 2.8 6.2 6.2 6.2zM54.9 510.1h9.9c3.4 0 6.2-2.8 6.2-6.2 0-3.4-2.8-6.2-6.2-6.2h-9.9c-3.4 0-6.2 2.8-6.2 6.2 0 3.4 2.8 6.2 6.2 6.2zM54.9 527.7h15.2c3.4 0 6.2-2.8 6.2-6.2 0-3.4-2.8-6.2-6.2-6.2H54.9c-3.4 0-6.2 2.8-6.2 6.2 0 3.5 2.8 6.2 6.2 6.2zM360 767.1c.1-.1 0-.1 0-.2v.2zM641.2 202.7c.1 0 .1 0 0 0 2.8 0 5.3-1.9 6-4.7 2.2-8.8 1.3-16.3-2.9-22.5-6.7-10-19-11.9-20.4-12.1-3.2-.4-6.2 1.6-6.9 4.8-2.3 10.5-1 18.9 4 25.1 7.4 9 19 9.3 20.2 9.4zm-7-20.2c1.2 1.9 1.9 4.1 1.9 6.7-1.8-.7-3.8-1.8-5.2-3.6-1.6-2-2.4-4.6-2.4-7.9 2 1 4.2 2.6 5.7 4.8zM601 113.3c-6.7-10-19-11.9-20.4-12.1-3.2-.4-6.2 1.6-6.9 4.8-2.3 10.5-1 18.9 4 25.1 7.2 9 18.8 9.3 20.1 9.3 2.8 0 5.3-1.9 6-4.7 2.3-8.6 1.4-16.2-2.8-22.4zm-13.5 10.1c-1.6-2-2.4-4.6-2.4-7.9 2.1 1 4.3 2.6 5.7 4.8 1.2 1.9 1.9 4.1 1.9 6.7-1.8-.7-3.8-1.8-5.2-3.6zM97.3 163.4c-1.4.2-13.6 2.1-20.4 12.1-4.1 6.2-5.1 13.7-2.9 22.5.7 2.7 3.2 4.7 6 4.7 1.3 0 12.9-.3 20.1-9.3 5-6.2 6.3-14.7 4-25.1-.6-3.2-3.6-5.3-6.8-4.9zm-6.7 22.2c-1.4 1.8-3.4 2.9-5.3 3.6 0-2.6.7-4.9 1.9-6.7 1.5-2.2 3.7-3.8 5.7-4.8 0 3.3-.8 5.9-2.3 7.9zM139.7 101.2c-1.4.2-13.6 2.1-20.4 12.1-4.1 6.2-5.1 13.7-2.9 22.5.7 2.7 3.2 4.7 6 4.7 1.3 0 12.9-.3 20.1-9.3 5-6.2 6.3-14.7 4-25.1-.7-3.2-3.6-5.3-6.8-4.9zm-6.8 22.2c-1.4 1.8-3.4 2.9-5.3 3.6 0-2.6.7-4.9 1.9-6.7 1.5-2.2 3.7-3.8 5.7-4.8 0 3.3-.7 5.9-2.3 7.9zM555.1 392c.4 3.2 3 5.5 6.1 5.5h.7c3.4-.4 5.8-3.5 5.4-6.9-6.2-54-43.1-92.2-44.7-93.8-2.4-2.4-6.3-2.5-8.7-.1-2.4 2.4-2.5 6.3-.1 8.7.4.4 35.6 36.9 41.3 86.6zM159.1 397.4h.7c3.1 0 5.8-2.3 6.1-5.5 5.7-49.7 40.9-86.2 41.2-86.5 2.4-2.4 2.3-6.4-.1-8.7-2.4-2.4-6.4-2.4-8.7.1-1.6 1.6-38.4 39.8-44.7 93.8-.3 3.4 2.1 6.4 5.5 6.8z"
	className="st2"
  ></path>
</g>
</svg>;

class KadenceImporter extends Component {
	constructor() {
		super( ...arguments );
		this.runAjax = this.runAjax.bind( this );
		this.runPluginInstall = this.runPluginInstall.bind( this );
		this.runPluginInstallSingle = this.runPluginInstallSingle.bind( this );
		this.runSubscribe = this.runSubscribe.bind( this );
		this.runSubscribeSingle = this.runSubscribeSingle.bind( this );
		this.loadTemplateData = this.loadTemplateData.bind( this );
		this.reloadTemplateData = this.reloadTemplateData.bind( this );
		this.loadPluginData = this.loadPluginData.bind( this );
		this.focusMode = this.focusMode.bind( this );
		this.fullFocusMode = this.fullFocusMode.bind( this );
		this.jumpToImport = this.jumpToImport.bind( this );
		this.selectedMode = this.selectedMode.bind( this );
		this.selectedFullMode = this.selectedFullMode.bind( this );
		this.backToDash = this.backToDash.bind( this );
		this.saveConfig = this.saveConfig.bind( this );
		this.state = {
			category: 'all',
			activeTemplate: '',
			colorPalette: '',
			fontPair: '',
			search: null,
			isFetching: false,
			isImporting: false,
			isSelected: false,
			response:'',
			isPageSelected: false,
			starterSettings: ( kadenceStarterParams.starterSettings ? JSON.parse( kadenceStarterParams.starterSettings ) : {} ),
			selectedPage: 'home',
			progress: '',
			focusMode: false,
			finished: false,
			overrideColors: false,
			overrideFonts: false,
			isOpenCheckColor: false,
			isOpenCheckFont: false,
			isOpenCheckPast: false,
			removePast: false,
			errorTemplates:false,
			templates: ( kadenceStarterParams.templates ? kadenceStarterParams.templates : [] ),
			etemplates: ( kadenceStarterParams.etemplates ? kadenceStarterParams.etemplates : [] ),
			activeTemplates: false,
			palettes: ( kadenceStarterParams.palettes ? kadenceStarterParams.palettes : [] ),
			fonts: ( kadenceStarterParams.fonts ? kadenceStarterParams.fonts : [] ),
			logo: ( kadenceStarterParams.logo ? kadenceStarterParams.logo : '' ),
			hasContent: ( kadenceStarterParams.has_content ? kadenceStarterParams.has_content : false ),
			hasPastContent: ( kadenceStarterParams.has_previous ? kadenceStarterParams.has_previous : false ),
			isSaving: false,
			isLoadingPlugins: false,
			activePlugins: false,
			showForm: true,
			templatePlugins: '',
			isSubscribed: kadenceStarterParams.subscribed ? true : false,
			email: kadenceStarterParams.user_email,
			privacy: false,
			emailError: false,
			privacyError: false,
			settingOpen: false,
			installContent: true,
			installCustomizer: true,
			installWidgets: true,
		};
	}
	componentDidMount() {
		if ( ! kadenceStarterParams.openBuilder && ! kadenceStarterParams.ctemplates ) {
			wp.api.loadPromise.then( () => {
				this.saveConfig( 'builderType', 'blocks' );
			});
		}
	}
	saveConfig( setting, settingValue ) {
		this.setState( { isSaving: true } );
		const config = ( kadenceStarterParams.starterSettings ? JSON.parse( kadenceStarterParams.starterSettings ) : {} );
		if ( ! config[ setting ] ) {
			config[ setting ] = '';
		}
		config[ setting ] = settingValue;
		this.setState( { starterSettings: config } );
		if ( wp.api.models.Settings ) {
			const settingModel = new wp.api.models.Settings( { kadence_starter_templates_config: JSON.stringify( config ) } );
			settingModel.save().then( response => {
				this.setState( { starterSettings: config, isSaving: false } );
				kadenceStarterParams.starterSettings = JSON.stringify( config );
			} );
		}
	}
	capitalizeFirstLetter( string ) {
		return string.charAt( 0 ).toUpperCase() + string.slice( 1 );
	}
	focusMode( template_id ) {
		this.setState( { activeTemplate: template_id, focusMode: true, isSelected: false, activePlugins:false } )
	}
	fullFocusMode( template_id ) {
		this.setState( { activeTemplate: template_id, focusMode: true, isSelected: true, activePlugins:false } )
	}
	jumpToImport( template_id ) {
		this.setState( { isImporting: true, activeTemplate: template_id, focusMode: true, isSelected: true, fontPair: '', colorPalette: '', activePlugins:false } )
	}
	selectedFullMode() {
		this.setState( { isSelected: true } );
	}
	selectedMode( page_id ) {
		this.setState( { selectedPage: page_id, isPageSelected: true, isImporting: true  } );
	}
	backToDash() {
		this.setState( { isFetching: false, activeTemplate: '', activePlugins:false, overrideColors:false, overrideFonts:false, colorPalette: '', fontPair: '', focusMode: false, finished: false, isImporting: false, isSelected:false, isPageSelected:false, progress: '', selectedPage: 'home' } );
	}
	reloadTemplateData() {
		this.setState( { errorTemplates: false, isSaving: true, activeTemplates: 'loading' } );
		var data_key = ( kadenceStarterParams.proData && kadenceStarterParams.proData.ktp_api_key ? kadenceStarterParams.proData.ktp_api_key : '' );
		var data_email = ( kadenceStarterParams.proData && kadenceStarterParams.proData.activation_email ? kadenceStarterParams.proData.activation_email : '' );
		if ( ! data_key ) {
			data_key = ( kadenceStarterParams.proData && kadenceStarterParams.proData.ithemes_key ? kadenceStarterParams.proData.ithemes_key : '' );
			if ( data_key ) {
				data_email = 'iThemes';
			}
		}
		var data = new FormData();
		data.append( 'action', 'kadence_import_reload_template_data' );
		data.append( 'security', kadenceStarterParams.ajax_nonce );
		data.append( 'api_key', data_key );
		data.append( 'api_email', data_email );
		data.append( 'template_type', this.state.starterSettings['builderType'] );
		var control = this;
		jQuery.ajax({
			method:      'POST',
			url:         kadenceStarterParams.ajax_url,
			data:        data,
			contentType: false,
			processData: false,
		})
		.done( function( response, status, stately ) {
			if ( response ) {
				const o = kadenceTryParseJSON( response );
				if ( o ) {
					control.setState( { activeTemplates: o, errorTemplates: false, isSaving: false } );
				} else {
					control.setState( { activeTemplates: 'error', errorTemplates: true, isSaving: false } );
				}
			}
		})
		.fail( function( error ) {
			console.log(error);
			control.setState( { activeTemplates: 'error', errorTemplates: true, isSaving: false } );
		});
	}
	loadTemplateData() {
		this.setState( { errorTemplates: false, isSaving: true, activeTemplates: 'loading' } );
		var data_key = ( kadenceStarterParams.proData && kadenceStarterParams.proData.ktp_api_key ? kadenceStarterParams.proData.ktp_api_key : '' );
		var data_email = ( kadenceStarterParams.proData && kadenceStarterParams.proData.activation_email ? kadenceStarterParams.proData.activation_email : '' );
		if ( ! data_key ) {
			data_key = ( kadenceStarterParams.proData && kadenceStarterParams.proData.ithemes_key ? kadenceStarterParams.proData.ithemes_key : '' );
			if ( data_key ) {
				data_email = 'iThemes';
			}
		}
		var data = new FormData();
		data.append( 'action', 'kadence_import_get_template_data' );
		data.append( 'security', kadenceStarterParams.ajax_nonce );
		data.append( 'api_key', data_key );
		data.append( 'api_email', data_email );
		data.append( 'template_type', this.state.starterSettings['builderType'] );
		var control = this;
		jQuery.ajax( {
			method:      'POST',
			url:         kadenceStarterParams.ajax_url,
			data:        data,
			contentType: false,
			processData: false,
		} )
		.done( function( response, status, stately ) {
			if ( response ) {
				const o = kadenceTryParseJSON( response );
				if ( o ) {
					control.setState( { activeTemplates: o, errorTemplates: false, isSaving: false } );
				} else {
					control.setState( { activeTemplates: 'error', errorTemplates: true, isSaving: false } );
				}
			}
		})
		.fail( function( error ) {
			console.log(error);
			control.setState( { activeTemplates: 'error', errorTemplates: true, isSaving: false } );
		});
	}
	loadPluginData( selected, builder ) {
		this.setState( { isLoadingPlugins: true } );
		var data = new FormData();
		data.append( 'action', 'kadence_check_plugin_data' );
		data.append( 'security', kadenceStarterParams.ajax_nonce );
		data.append( 'selected', selected );
		data.append( 'builder', builder );
		var control = this;
		jQuery.ajax( {
			method:      'POST',
			url:         kadenceStarterParams.ajax_url,
			data:        data,
			contentType: false,
			processData: false,
		} )
		.done( function( response, status, stately ) {
			if ( response ) {
				if ( 'undefined' !== typeof response.success ) {
					control.setState( { templatePlugins: 'error', activePlugins: true, isLoadingPlugins: false } );
				} else {
					//const o = kadenceTryParseJSON( response );
					if ( typeof response === 'object' && response !== null ) {
						control.setState( { templatePlugins: response, activePlugins: true, isLoadingPlugins: false } );
					} else {
						control.setState( { templatePlugins: 'error', activePlugins: true, isLoadingPlugins: false } );
					}
				}
			}
		})
		.fail( function( error ) {
			console.log(error);
			control.setState( { templatePlugins: 'error', activePlugins: true, isLoadingPlugins: false } );
		});
	}
	runPluginInstallSingle( selected, page_id, builder ) {
		this.setState( { progress: 'plugins', isFetching: true, showForm: false } );
		var data = new FormData();
		data.append( 'action', 'kadence_import_install_plugins' );
		data.append( 'security', kadenceStarterParams.ajax_nonce );
		data.append( 'selected', selected );
		data.append( 'builder', builder );
		data.append( 'page_id', page_id );
		this.runPageAjax( data );
	}
	runSubscribeSingle( email ) {
		this.setState( { progress: 'subscribe', isFetching: true, showForm: false } );
		var data = new FormData();
		data.append( 'action', 'kadence_import_subscribe' );
		data.append( 'security', kadenceStarterParams.ajax_nonce );
		data.append( 'email', email );
		this.runPageAjax( data );
	}
	runRemovePast( selected, builder ) {
		this.setState( { progress: 'remove', isFetching: true, showForm: false } );
		var data = new FormData();
		data.append( 'action', 'kadence_remove_past_import_data' );
		data.append( 'security', kadenceStarterParams.ajax_nonce );
		data.append( 'selected', selected );
		data.append( 'builder', builder );
		this.runAjax( data );
	}
	runPluginInstall( selected, builder ) {
		this.setState( { progress: 'plugins', isFetching: true, showForm: false } );
		var data = new FormData();
		data.append( 'action', 'kadence_import_install_plugins' );
		data.append( 'security', kadenceStarterParams.ajax_nonce );
		data.append( 'selected', selected );
		data.append( 'builder', builder );
		this.runAjax( data );
	}
	runSubscribe( email ) {
		this.setState( { progress: 'subscribe', isFetching: true, showForm: false } );
		var data = new FormData();
		data.append( 'action', 'kadence_import_subscribe' );
		data.append( 'security', kadenceStarterParams.ajax_nonce );
		data.append( 'email', email );
		this.runAjax( data );
	}
	runPageAjax( data ) {
		var control = this;
		jQuery.ajax({
			method:      'POST',
			url:         kadenceStarterParams.ajax_url,
			data:        data,
			contentType: false,
			processData: false,
		})
		.done( function( response, status, stately ) {
			if ( 'undefined' !== typeof response.status && 'newAJAX' === response.status ) {
				control.state.progress = 'contentNew';
				control.runPageAjax( data );
			} else if ( 'undefined' !== typeof response.status && 'subscribeSuccess' === response.status ) {
				control.setState( { progress: 'plugins' } );
				var newData = new FormData();
				newData.append( 'action', 'kadence_import_install_plugins' );
				newData.append( 'security', kadenceStarterParams.ajax_nonce );
				newData.append( 'selected', control.state.activeTemplate );
				newData.append( 'builder', control.state.starterSettings['builderType'] );
				newData.append( 'page_id', control.state.selectedPage );
				control.runPageAjax( newData );
			} else if ( 'undefined' !== typeof response.status && 'pluginSuccess' === response.status ) {
				control.setState( { progress: 'content' } );
				var newData = new FormData();
				newData.append( 'action', 'kadence_import_single_data' );
				newData.append( 'security', kadenceStarterParams.ajax_nonce );
				newData.append( 'selected', control.state.activeTemplate );
				newData.append( 'builder', control.state.starterSettings['builderType'] );
				newData.append( 'page_id', control.state.selectedPage );
				newData.append( 'override_colors', control.state.overrideColors );
				newData.append( 'override_fonts', control.state.overrideFonts );
				newData.append( 'palette', control.state.colorPalette );
				newData.append( 'font', control.state.fontPair );
				control.runPageAjax( newData );
			} else if ( 'undefined' !== typeof response.message ) {
				//jQuery( '.kadence_starter_templates_finished' ).append( '<p>' + response.message + '</p>' );
				control.setState( { finished: true, hasContent:true, hasPastContent:true, isFetching: false, colorPalette: '', fontPair: '', focusMode: false, isImporting: false, isSelected:false, progress: '', showForm: true, response: '<p>' + response.message + '</p>' } );
			} else if ( response === 'emailDomainPostError' || response === 'emailDomainPreError' ) {
				control.setState( { isFetching: false, progress: '', showForm: true, emailError: true } );
			} else {
				//jQuery( '.kadence_starter_templates_error' ).append( '<div class="notice kadence_starter_templates_response notice-error"><p>' + response + '</p></div>' );
				control.setState( { finished: true, hasContent:true, hasPastContent:true, isFetching: false, colorPalette: '', fontPair: '', focusMode: false, isImporting: false, isSelected:false, progress: '', showForm: true, response: '<div class="notice kadence_starter_templates_response notice-error"><p>' + response + '</p></div>' } );
			}
		})
		.fail( function( error ) {
			//jQuery( '.kadence_starter_templates_error' ).append( '<div class="notice kadence_starter_templates_response notice-error"><p>Error: ' + error.statusText + ' (' + error.status + ')' + '</p></div>' );
			control.setState( { finished: true, hasContent:true, hasPastContent:true, isFetching: false, colorPalette: '', fontPair: '', focusMode: false, isImporting: false, isSelected:false, progress: '', showForm: true, response: '<div class="notice kadence_starter_templates_response notice-error"><p>Error: ' + error.statusText + ' (' + error.status + ')' + '</p></div>' } );
		});
	}
	runAjax( data ) {
		var control = this;
		jQuery.ajax({
			method:      'POST',
			url:         kadenceStarterParams.ajax_url,
			data:        data,
			contentType: false,
			processData: false,
		})
		.done( function( response, status, stately ) {
			if ( 'undefined' !== typeof response.status && 'newAJAX' === response.status ) {
				control.state.progress = 'contentNew';
				control.runAjax( data );
			} else if ( 'undefined' !== typeof response.status && 'customizerAJAX' === response.status ) {
				var newData = new FormData();
				newData.append( 'security', kadenceStarterParams.ajax_nonce );
				if ( control.state.installCustomizer ) {
					control.setState( { progress: 'customizer' } );
					newData.append( 'action', 'kadence_import_customizer_data' );
					newData.append( 'wp_customize', 'on' );
				} else {
					control.setState( { progress: 'widgets' } );
					newData.append( 'action', 'kadence_after_import_data' );
				}
				control.runAjax( newData );
			} else if ( 'undefined' !== typeof response.status && 'afterAllImportAJAX' === response.status ) {
				control.setState( { progress: 'widgets' } );
				var newData = new FormData();
				newData.append( 'action', 'kadence_after_import_data' );
				newData.append( 'security', kadenceStarterParams.ajax_nonce );
				control.runAjax( newData );
			} else if ( 'undefined' !== typeof response.status && 'pluginSuccess' === response.status ) {
				var newData = new FormData();
				newData.append( 'security', kadenceStarterParams.ajax_nonce );
				if ( control.state.installContent ) {
					control.setState( { progress: 'content' } );
					newData.append( 'action', 'kadence_import_demo_data' );
					newData.append( 'builder', control.state.starterSettings['builderType'] );
					newData.append( 'selected', control.state.activeTemplate );
					newData.append( 'palette', control.state.colorPalette );
					newData.append( 'font', control.state.fontPair );
				} else if ( control.state.installCustomizer ) {
					control.setState( { progress: 'customizer' } );
					newData.append( 'action', 'kadence_import_customizer_data' );
					newData.append( 'wp_customize', 'on' );
				} else {
					control.setState( { progress: 'widgets' } );
					newData.append( 'action', 'kadence_after_import_data' );
				}
				control.runAjax( newData );
			} else if ( 'undefined' !== typeof response.status && 'removeSuccess' === response.status ) {
				control.setState( { progress: 'plugins' } );
				var newData = new FormData();
				newData.append( 'action', 'kadence_import_install_plugins' );
				newData.append( 'security', kadenceStarterParams.ajax_nonce );
				newData.append( 'selected', control.state.activeTemplate );
				newData.append( 'builder', control.state.starterSettings['builderType'] );
				control.runAjax( newData );
			} else if ( 'undefined' !== typeof response.status && 'subscribeSuccess' === response.status ) {
				var newData = new FormData();
				if ( control.state.removePast ) {
					this.setState( { progress: 'remove' } );
					newData.append( 'action', 'kadence_remove_past_import_data' );
				} else {
					control.setState( { progress: 'plugins' } );
					newData.append( 'action', 'kadence_import_install_plugins' );
				}
				newData.append( 'security', kadenceStarterParams.ajax_nonce );
				newData.append( 'selected', control.state.activeTemplate );
				newData.append( 'builder', control.state.starterSettings['builderType'] );
				control.runAjax( newData );
			} else if ( 'undefined' !== typeof response.message ) {
				//jQuery( '.kadence_starter_templates_finished' ).append( '<p>' + response.message + '</p>' );
				control.setState( { finished: true, hasContent:true, hasPastContent:true, isFetching: false, colorPalette: '', fontPair: '', focusMode: false, isImporting: false, isSelected:false, isPageSelected:false, progress: '', showForm: true, response: '<p>' + response.message + '</p>' } );
			} else if ( 'undefined' !== typeof response.success && ! response.success ) {
				//jQuery( '.kadence_starter_templates_finished' ).append( '<p>' + response.message + '</p>' );
				control.setState( { finished: true, hasContent:true, hasPastContent:true, isFetching: false, colorPalette: '', fontPair: '', focusMode: false, isImporting: false, isSelected:false, isPageSelected:false, progress: '', showForm: true, response: '<div class="notice kadence_starter_templates_response notice-error"><p>' + __( 'Failed Import. Something went wrong internally. Please try again.', 'kadence-starter-templates' ) + '</p></div>'  } );
			} else {
				console.log( response );
				//jQuery( '.kadence_starter_templates_error' ).append( '<div class="notice kadence_starter_templates_response notice-error"><p>' + response + '</p></div>' );
				control.setState( { finished: true, hasContent:true, hasPastContent:true, isFetching: false, colorPalette: '', fontPair: '', focusMode: false, isImporting: false, isSelected:false, isPageSelected:false, progress: '', showForm: true, response: '<div class="notice kadence_starter_templates_response notice-error"><p>' + response + '</p></div>'  } );
			}
		})
		.fail( function( error ) {
			console.log( error );
			//jQuery( '.kadence_starter_templates_error' ).append( '<div class="notice kadence_starter_templates_response notice-error"><p>Error: ' + error.statusText + ' (' + error.status + ')' + '</p></div>' );
			control.setState( { finished: true, hasContent:true, hasPastContent:true, isFetching: false, colorPalette: '', fontPair: '', focusMode: false, isImporting: false, isSelected:false, isPageSelected:false, progress: '', showForm: true, response: '<div class="notice kadence_starter_templates_response notice-error"><p>Error: ' + error.statusText + ' (' + error.status + ')' + '</p></div>' } );
		});
	}
	render() {
		const cats = [ 'all' ];
		for ( let i = 0; i < this.state.templates.length; i++ ) {
			for ( let c = 0; c < this.state.templates[ i ].categories.length; c++ ) {
				if ( ! cats.includes( this.state.templates[ i ].categories[ c ] ) ) {
					cats.push( this.state.templates[ i ].categories[ c ] );
				}
			}
		}
		const catOptions = cats.map( ( item ) => {
			return { value: item, label: this.capitalizeFirstLetter( item ) }
		} );
		let builderTypeName = __( 'Gutenberg', 'kadence-starter-templates' );
		let builderTypeIcon = gbIcon;
		if ( this.state.starterSettings['builderType'] === 'elementor' ) {
			builderTypeName = __( 'Elementor', 'kadence-starter-templates' );
			builderTypeIcon = eIcon;
		}
		if ( this.state.starterSettings['builderType'] === 'custom' ) {
			builderTypeName = ( kadenceStarterParams.custom_name ? kadenceStarterParams.custom_name : __( 'Pro Designs', 'kadence-starter-templates' ) );
			builderTypeIcon = ( kadenceStarterParams.custom_icon ? <img className="components-menu-items__item-icon custom-image-icon-src" src={ kadenceStarterParams.custom_icon } /> : cIcon );
		}
		const errorMessageShow = ( this.state.isSaving || false === this.state.activeTemplates || this.state.errorTemplates ? true : false );
		const KadenceImportSingleMode = () => {
			const item = this.state.activeTemplates[this.state.activeTemplate];
			let pluginsMember = false;
			let pluginsPremium = false;
			return (
				<div className="kst-grid-single-site">
					<div className="kst-import-selection-item">
						<div className="kst-import-selection">
							<img src={ item.pages[this.state.selectedPage].image } alt={ item.pages[this.state.selectedPage].title } />
						</div>
					</div>
					<div className="kst-import-selection-options">
						<div className="kst-import-single-selection-options-wrap">
							<div className="kst-import-selection-title">
								<h2>{ __( 'Template:', 'kadence-starter-templates' ) } <span>{ item.name }</span><br></br> { __( 'Selected Page:', 'kadence-starter-templates' ) } <span>{ item.pages[this.state.selectedPage].title }</span></h2>
							</div>
							<PanelBody
								title={ __( 'Advanced Settings', 'kadence-blocks' ) }
								initialOpen={ this.state.settingOpen }
								onToggle={ value => ( this.state.settingOpen ? this.setState( { settingOpen: false } ) : this.setState( { settingOpen: true } ) ) }
							>
								<div className="kst-import-grid-title">
									<h2>{ __( 'Page Template Plugins', 'kadence-starter-templates' ) }</h2>
								</div>
								{ this.state.isLoadingPlugins && (
									<Spinner />
								) }
								{ ! this.state.activePlugins && ! this.state.isLoadingPlugins && (
									<Fragment>{ this.loadPluginData( item.slug, this.state.starterSettings['builderType'] ) }</Fragment>
								) }
								{ this.state.activePlugins && (
									<Fragment>
										{ this.state.templatePlugins && 'error' !== this.state.templatePlugins && (
											<ul className="kadence-required-wrap">
												{ map( this.state.templatePlugins, ( { state, src, title } ) => {
													if ( 'active' !== state && 'bundle' === src ) {
														pluginsMember = true;
													}
													if ( 'active' !== state && ( 'thirdparty' === src || 'unknown' === src ) ) {
														pluginsPremium = true;
													}
													return (
														<li className={ `plugin-required${ ( 'active' !== state && 'bundle' === src ? ' bundle-install-required' : '' ) }` }>
															{ title } - <span class="plugin-status">{ ( 'notactive' === state ? __( 'Not Installed', 'kadence-starter-templates' ) : state ) }</span> { ( 'active' !== state && 'thirdparty' === src ? <span class="plugin-install-required">{ __( 'Please install and activate this third-party premium plugin' ) }</span> : '' ) }
														</li>
													);
												} ) }
											</ul>
										) }
										{ this.state.templatePlugins && 'error' === this.state.templatePlugins && (
											<Fragment>
												<p className="desc-small install-third-party-notice">{ __( '*Error accessing active plugin information, you may import but first manually check that you have installed all required plugins.', 'kadence-starter-templates' ) }</p>
												<ul className="kadence-required-wrap">
													{ map( item.plugins, ( slug ) => {
														if ( kadenceStarterParams.plugins[ slug ] ) {
															if ( 'active' !== kadenceStarterParams.plugins[ slug ].state && 'bundle' === kadenceStarterParams.plugins[ slug ].src ) {
																pluginsMember = true;
															}
															return (
																<li className={ `plugin-required${ ( 'active' !== kadenceStarterParams.plugins[ slug ].state && 'bundle' === kadenceStarterParams.plugins[ slug ].src ? ' bundle-install-required' : '' ) }` }>
																	{ kadenceStarterParams.plugins[ slug ].title } - <span class="plugin-status">{ ( 'notactive' === kadenceStarterParams.plugins[ slug ].state ? __( 'Not Installed', 'kadence-starter-templates' ) : kadenceStarterParams.plugins[ slug ].state ) }</span> { ( 'active' !== kadenceStarterParams.plugins[ slug ].state && 'thirdparty' === kadenceStarterParams.plugins[ slug ].src ? <span class="plugin-install-required">{ __( 'Please install and activate this third-party premium Plugin' ) }</span> : '' ) }
																</li>
															);
														} else {
															return (
																<li className={ `plugin-required` }>
																	{ slug } - <span class="plugin-status">{ __( 'Unknown', 'kadence-starter-templates' ) }</span>
																</li>
															);
														}
													} ) }	
												</ul>
											</Fragment>
										) }
									</Fragment>
								) }
								<p className="desc-small note-about-colors">{ __( '*Single Page templates will follow your website current global colors and typography settings, you can import without effecting your current site. Or you can optionally override your websites global colors and typography by enabling the settings below.', 'kadence-starter-templates' ) }</p>
								<ToggleControl
									label={ __( 'Override Your Sites Global Colors?', 'kadence-starter-templates' ) }
									checked={ ( undefined !== this.state.overrideColors ? this.state.overrideColors : false ) }
									onChange={ value => ( this.state.overrideColors ? this.setState( { overrideColors: false } ) : this.setState( { isOpenCheckColor: true } ) ) }
								/>
								{ this.state.isOpenCheckColor ?
									<Modal
										className="ksp-confirm-modal"
										title={ __( 'Override Your Sites Colors on Import?', 'kadence-starter-templates' ) }
										onRequestClose={ () => {
											this.setState( { isOpenCheckColor: false } )
										} }>
										<p className="desc-small note-about-colors">{ __( 'This will override the customizer settings for global colors on your current site when you import this page template.', 'kadence-starter-templates' ) }</p>
										<div className="ksp-override-model-buttons">
											<Button className="ksp-cancel-override" onClick={ () => {
												this.setState( { isOpenCheckColor: false, overrideColors: false } );
											} }>
												{ __( 'Cancel', 'kadence-starter-templates' ) }
											</Button>
											<Button className="ksp-do-override" isPrimary onClick={ () => {
												this.setState( { isOpenCheckColor: false, overrideColors: true } );
											} }>
												{ __( 'Override Colors', 'kadence-starter-templates' ) }
											</Button>
										</div>
									</Modal>
									: null }
								{ this.state.overrideColors && this.state.colorPalette && (
									<Fragment>
										<h3>{ __( 'Selected Color Palette', 'kadence-starter-templates' ) }</h3>
										{ map( this.state.palettes, ( { palette, colors } ) => {
											if ( palette !== this.state.colorPalette ) {
												return;
											}
											return (
												<div className="kst-palette-btn kst-selected-color-palette">
													{ map( colors, ( color, index ) => {
														return (
															<div key={ index } style={ {
																width: 22,
																height: 22,
																marginBottom: 0,
																marginRight:'3px',
																transform: 'scale(1)',
																transition: '100ms transform ease',
															} } className="kadence-swatche-item-wrap">
																<span
																	className={ 'kadence-swatch-item' }
																	style={ {
																		height: '100%',
																		display: 'block',
																		width: '100%',
																		border: '1px solid rgb(218, 218, 218)',
																		borderRadius: '50%',
																		color: `${ color }`,
																		boxShadow: `inset 0 0 0 ${ 30 / 2 }px`,
																		transition: '100ms box-shadow ease',
																	} }
																	>
																</span>
															</div>
														)
													} ) }
												</div>
											)
										} ) }
									</Fragment>
								) }
								<ToggleControl
									label={ __( 'Override Your Sites Fonts?', 'kadence-starter-templates' ) }
									checked={ ( undefined !== this.state.overrideFonts ? this.state.overrideFonts : false ) }
									onChange={ value => ( this.state.overrideFonts ? this.setState( { overrideFonts: false } ) : this.setState( { isOpenCheckFont: true } ) ) }
								/>
								{ this.state.isOpenCheckFont ?
									<Modal
										className="ksp-confirm-modal"
										title={ __( 'Override Your Sites Fonts on Import?', 'kadence-starter-templates' ) }
										onRequestClose={ () => {
											this.setState( { isOpenCheckFont: false } )
										} }>
										<p className="desc-small note-about-colors">{ __( 'This will override the customizer typography settings on your current site when you import this page template.', 'kadence-starter-templates' ) }</p>
										<div className="ksp-override-model-buttons">
											<Button className="ksp-cancel-override" onClick={ () => {
												this.setState( { isOpenCheckFont: false, overrideFonts: false } );
											} }>
												{ __( 'Cancel', 'kadence-starter-templates' ) }
											</Button>
											<Button className="ksp-do-override" isPrimary onClick={ () => {
												this.setState( { isOpenCheckFont: false, overrideFonts: true } );
											} }>
												{ __( 'Override Fonts', 'kadence-starter-templates' ) }
											</Button>
										</div>
									</Modal>
								: null }
								{ this.state.fontPair && this.state.overrideFonts && (
									<Fragment>
										<h3 className="kst-selected-font-pair-title">{ __( 'Selected Font Pair', 'kadence-starter-templates' ) }</h3>
										{ map( this.state.fonts, ( { font, img, name } ) => {
											if ( font !== this.state.fontPair ) {
												return;
											}
											return (
												<div className="kst-selected-font-pair">
													<img src={ img } className="font-pairing" />
													<h4>{ name }</h4>
												</div>
											)
										} ) }
									</Fragment>
								) }
							</PanelBody>
							{ this.state.progress === 'subscribe' && (
								<div class="kadence_starter_templates_response">{ kadenceStarterParams.subscribe_progress }</div>
							) }
							{ this.state.progress === 'plugins' && (
								<div class="kadence_starter_templates_response">{ kadenceStarterParams.plugin_progress }</div>
							) }
							{ this.state.progress === 'content' && (
								<div class="kadence_starter_templates_response">{ kadenceStarterParams.content_progress }</div>
							) }
							{ this.state.progress === 'contentNew' && (
								<div class="kadence_starter_templates_response">{ kadenceStarterParams.content_new_progress }</div>
							) }
							{ this.state.isFetching && (
								<Spinner />
							) }
							{ ! kadenceStarterParams.isKadence && (
								<div class="kadence_starter_templates_response">
									<h2>{ __( 'This Template Requires the Kadence Theme', 'kadence-starter-templates' ) }</h2>
									<ExternalLink href={ 'https://kadence-theme.com/' }>{ __( 'Get Free Theme', 'kadence-starter-templates' ) }</ExternalLink>
								</div>
							) }
							{ kadenceStarterParams.isKadence && (
								<Fragment>
									{ pluginsMember && (
										<div class="kadence_starter_templates_response">
											<h2>{ __( 'Install Missing/Inactive Highlighted Premium plugins to Import', 'kadence-starter-templates' ) }</h2>
											<ExternalLink href={ 'https://www.kadencewp.com/my-account/' }>{ __( 'Pro Account', 'kadence-starter-templates' ) }</ExternalLink>
										</div>
									) }
									{ ! pluginsMember && (
										<Fragment>
											{ this.state.showForm && ! this.state.isSubscribed && (
												<Fragment>
													<KadenceSubscribeForm
														emailError={ this.state.emailError }
														onRun={ email => this.runSubscribeSingle( email ) }
													/>
													<Button className="kb-skip-start subscribe" isPrimary disabled={ this.state.isFetching } onClick={ () => {
															this.runPluginInstallSingle( item.slug, this.state.selectedPage, this.state.starterSettings['builderType'] );
														} }>
															{ __( 'Skip, start importing page', 'kadence-starter-templates' ) }
													</Button>
												</Fragment>
											) }
											{ this.state.showForm && this.state.isSubscribed && (
												<Fragment>
													<Button className="kt-defaults-save" isPrimary disabled={ this.state.isFetching } onClick={ () => {
															this.runPluginInstallSingle( item.slug, this.state.selectedPage, this.state.starterSettings['builderType'] );
														} }>
															{ __( 'Start Importing Page', 'kadence-starter-templates' ) }
													</Button>
												</Fragment>
											) }
										</Fragment>
									) }
								</Fragment>
							) }
						</div>
					</div>
				</div>
			);
		}
		const KadenceImportMode = () => {
			const item = this.state.activeTemplates[this.state.activeTemplate];
			let pluginsPremium = false;
			let pluginsMember = false;
			return (
				<Fragment>
					<div className="kst-grid-single-site">
						<div className="kst-import-selection-item">
							<div className="kst-import-selection">
								<img src={ item.pages && item.pages['home'] && item.pages['home'].image ? item.pages['home'].image : item.image } alt={ item.name } />
							</div>
						</div>
						<div className="kst-import-selection-options">
							<div className="kst-import-selection-title">
								<div className="kst-import-single-selection-options-wrap">
									<h2>{ __( 'Template:', 'kadence-starter-templates' ) } <span>{ item.name }</span></h2>
								</div>
							</div>
						</div>
					</div>
					<Modal
						className="kst-import-modal"
						title={ __( 'Import Starter Template' ) }
						onRequestClose={ () => this.state.isFetching ? false : this.setState( { activeTemplate: '', activePlugins: false, colorPalette: '', focusMode: false, isImporting: false, progress: '' } ) }>
							{ ! kadenceStarterParams.isKadence && (
								<div class="kadence_starter_templates_response">
									<h2>{ __( 'This Starter Template Requires the Kadence Theme', 'kadence-starter-templates' ) }</h2>
									<ExternalLink href={ 'https://kadence-theme.com/' }>{ __( 'Get Free Theme', 'kadence-starter-templates' ) }</ExternalLink>
								</div>
							) }
							{  kadenceStarterParams.isKadence && (
								<Fragment>
									{ this.state.hasContent && (
										<div className="kadence_starter_templates_notice">
											{ this.state.hasPastContent ? (
												<Fragment>{ kadenceStarterParams.notice_previous }</Fragment>
											) : (
												<Fragment>{ kadenceStarterParams.notice }</Fragment>
											) }
										</div>
									) }
									{ this.state.hasPastContent && (
										<Fragment>
											<ToggleControl
												label={ __( 'Delete Previously Imported Posts and Images?', 'kadence-starter-templates' ) }
												checked={ ( undefined !== this.state.removePast ? this.state.removePast : false ) }
												onChange={ value => ( this.state.removePast ? this.setState( { removePast: false } ) : this.setState( { removePast: true } ) ) }
											/>
										</Fragment>
									) }
									<PanelBody
										title={ __( 'Import Details', 'kadence-blocks' ) }
										initialOpen={ false }
									>
										<div className="required-plugins-list">
											<h3 className="required-plugins-list-header">{ __( 'Required Plugins', 'kadence-starter-templates' ) }</h3>
											{ this.state.isLoadingPlugins && (
												<Spinner />
											) }
											{ ! this.state.activePlugins && ! this.state.isLoadingPlugins && (
												<Fragment>{ this.loadPluginData( item.slug, this.state.starterSettings['builderType'] ) }</Fragment>
											) }
											{ this.state.activePlugins && (
												<Fragment>
													{ this.state.templatePlugins && 'error' !== this.state.templatePlugins && (
														<ul className="kadence-required-wrap">
															{ map( this.state.templatePlugins, ( { state, src, title } ) => {
																if ( 'active' !== state && 'bundle' === src ) {
																	pluginsMember = true;
																}
																if ( 'active' !== state && 'thirdparty' === src ) {
																	pluginsPremium = true;
																}
																return (
																	<li className={ `plugin-required${ ( 'active' !== state && 'bundle' === src ? ' bundle-install-required' : '' ) }` }>
																		{ title } - <span class="plugin-status">{ ( 'notactive' === state ? __( 'Not Installed', 'kadence-starter-templates' ) : state ) }</span> { ( 'active' !== state && 'thirdparty' === src ? <span class="plugin-install-required">{ __( 'Please install and activate this third-party premium plugin' ) }</span> : '' ) }
																	</li>
																);
															} ) }
														</ul>
													) }
													{ this.state.templatePlugins && 'error' === this.state.templatePlugins && (
														<Fragment>
															<p className="desc-small install-third-party-notice">{ __( '*Error accessing active plugin information, you may import but first manually check that you have installed all required plugins.', 'kadence-starter-templates' ) }</p>
															<ul className="kadence-required-wrap">
																{ map( item.plugins, ( slug ) => {
																	if ( kadenceStarterParams.plugins[ slug ] ) {
																		if ( 'active' !== kadenceStarterParams.plugins[ slug ].state && 'bundle' === kadenceStarterParams.plugins[ slug ].src ) {
																			pluginsMember = true;
																		}
																		return (
																			<li className={ `plugin-required${ ( 'active' !== kadenceStarterParams.plugins[ slug ].state && 'bundle' === kadenceStarterParams.plugins[ slug ].src ? ' bundle-install-required' : '' ) }` }>
																				{ kadenceStarterParams.plugins[ slug ].title } - <span class="plugin-status">{ ( 'notactive' === kadenceStarterParams.plugins[ slug ].state ? __( 'Not Installed', 'kadence-starter-templates' ) : kadenceStarterParams.plugins[ slug ].state ) }</span> { ( 'active' !== kadenceStarterParams.plugins[ slug ].state && 'thirdparty' === kadenceStarterParams.plugins[ slug ].src ? <span class="plugin-install-required">{ __( 'Please install and activate this third-party premium Plugin' ) }</span> : '' ) }
																			</li>
																		);
																	} else {
																		return (
																			<li className={ `plugin-required` }>
																				{ slug } - <span class="plugin-status">{ __( 'Unknown', 'kadence-starter-templates' ) }</span>
																			</li>
																		);
																	}
																} ) }	
															</ul>
														</Fragment>
													) }
												</Fragment>
											) }
										</div>
										{ this.state.colorPalette && (
											<Fragment>
												<h3>{ __( 'Selected Color Palette', 'kadence-starter-templates' ) }</h3>
												{ map( this.state.palettes, ( { palette, colors } ) => {
													if ( palette !== this.state.colorPalette ) {
														return;
													}
													return (
														<div className="kst-palette-btn kst-selected-color-palette">
															{ map( colors, ( color, index ) => {
																return (
																	<div key={ index } style={ {
																		width: 22,
																		height: 22,
																		marginBottom: 0,
																		marginRight:'3px',
																		transform: 'scale(1)',
																		transition: '100ms transform ease',
																	} } className="kadence-swatche-item-wrap">
																		<span
																			className={ 'kadence-swatch-item' }
																			style={ {
																				height: '100%',
																				display: 'block',
																				width: '100%',
																				border: '1px solid rgb(218, 218, 218)',
																				borderRadius: '50%',
																				color: `${ color }`,
																				boxShadow: `inset 0 0 0 ${ 30 / 2 }px`,
																				transition: '100ms box-shadow ease',
																			} }
																			>
																		</span>
																	</div>
																)
															} ) }
														</div>
													)
												} ) }
											</Fragment>
										) }
										{ this.state.fontPair && (
											<Fragment>
												<h3 className="kst-selected-font-pair-title">{ __( 'Selected Font Pair', 'kadence-starter-templates' ) }</h3>
												{ map( this.state.fonts, ( { font, img, name } ) => {
													if ( font !== this.state.fontPair ) {
														return;
													}
													return (
														<div className="kst-selected-font-pair">
															<img src={ img } className="font-pairing" />
															<h4>{ name }</h4>
														</div>
													)
												} ) }
											</Fragment>
										) }
									</PanelBody>
									<PanelBody
										title={ __( 'Advanced Settings', 'kadence-blocks' ) }
										initialOpen={ false }
									>
										<ToggleControl
											label={ __( 'Import Customizer Settings', 'kadence-starter-templates' ) }
											checked={ ( undefined !== this.state.installCustomizer ? this.state.installCustomizer : false ) }
											onChange={ value => ( this.state.installCustomizer ? this.setState( { installCustomizer: false } ) : this.setState( { installCustomizer: true } ) ) }
										/>
										<ToggleControl
											label={ __( 'Import Content', 'kadence-starter-templates' ) }
											checked={ ( undefined !== this.state.installContent ? this.state.installContent : false ) }
											onChange={ value => ( this.state.installContent ? this.setState( { installContent: false } ) : this.setState( { installContent: true } ) ) }
										/>
									</PanelBody>
									{ pluginsPremium && (
										<div className="install-third-party-notice">
											<p className="desc-small">
												{ __( '*This starter template requires premium third-party plugins. Please install missing/inactive premium plugins to import.', 'kadence-starter-templates' ) }
											</p>
											{ map( this.state.templatePlugins, ( { state, src, title } ) => {
												if ( 'active' === state || 'repo' === src  ) {
													return;
												}
												if ( 'active' !== state && 'bundle' === src ) {
													pluginsMember = true;
												}
												if ( 'active' !== state && 'thirdparty' === src ) {
													pluginsPremium = true;
												}
												return (
													<li className={ `plugin-required${ ( 'active' !== state && 'bundle' === src ? ' bundle-install-required' : '' ) }` }>
														{ title } - <span class="plugin-status">{ ( 'notactive' === state ? __( 'Not Installed', 'kadence-starter-templates' ) : state ) }</span>
													</li>
												);
											} ) }
										</div>
									) }
									{ this.state.progress === 'subscribe' && (
										<div class="kadence_starter_templates_response">{ kadenceStarterParams.subscribe_progress }</div>
									) }
									{ this.state.progress === 'remove' && (
										<div class="kadence_starter_templates_response">{ kadenceStarterParams.remove_progress }</div>
									) }
									{ this.state.progress === 'plugins' && (
										<div class="kadence_starter_templates_response">{ kadenceStarterParams.plugin_progress }</div>
									) }
									{ this.state.progress === 'content' && (
										<div class="kadence_starter_templates_response">{ kadenceStarterParams.content_progress }</div>
									) }
									{ this.state.progress === 'contentNew' && (
										<div class="kadence_starter_templates_response">{ kadenceStarterParams.content_new_progress }</div>
									) }
									{ this.state.progress === 'customizer' && (
										<div class="kadence_starter_templates_response">{ kadenceStarterParams.customizer_progress }</div>
									) }
									{ this.state.progress === 'widgets' && (
										<div class="kadence_starter_templates_response">{ kadenceStarterParams.widgets_progress }</div>
									) }
									{ this.state.isFetching && (
										<Spinner />
									) }
									{ kadenceStarterParams.isKadence && (
										<Fragment>
											{ pluginsPremium && (
												<Fragment>
													{ pluginsMember && (
														<div class="kadence_starter_templates_response">
															<h2>{ __( 'Install Missing/Inactive Highlighted Premium plugins to Import', 'kadence-starter-templates' ) }</h2>
															<ExternalLink href={ 'https://www.kadencewp.com/my-account/' }>{ __( 'Pro Account', 'kadence-starter-templates' ) }</ExternalLink>
														</div>
													) }
													{ ! pluginsMember && (
														<Button className="kt-defaults-save import-partial-btn" isPrimary disabled={ this.state.isFetching } onClick={ () => {
															if ( this.state.removePast ) {
																this.runRemovePast( item.slug, this.state.starterSettings['builderType'] );
															} else {
																this.runPluginInstall( item.slug, this.state.starterSettings['builderType'] );
															}
														} }>
															{ __( 'Skip and Import with Partial Content' ) }
														</Button>
													) }
												</Fragment>
											) }
											{ ! pluginsPremium && (
												<Fragment>
													{ pluginsMember && (
														<div class="kadence_starter_templates_response">
															<h2>{ __( 'Install Missing/Inactive Highlighted Premium plugins to Import', 'kadence-starter-templates' ) }</h2>
															<ExternalLink href={ 'https://www.kadencewp.com/my-account/' }>{ __( 'Pro Account', 'kadence-starter-templates' ) }</ExternalLink>
														</div>
													) }
													{ ! pluginsMember && (
														<Fragment>
															{ this.state.showForm && ! this.state.isSubscribed && (
																<Fragment>
																	<KadenceSubscribeForm
																		emailError={ this.state.emailError }
																		onRun={ email => this.runSubscribe( email ) }
																	/>
																	<Button className="kb-skip-start" isPrimary disabled={ this.state.isFetching } onClick={ () => {
																		if ( this.state.removePast ) {
																			this.runRemovePast( item.slug, this.state.starterSettings['builderType'] );
																		} else {
																			this.runPluginInstall( item.slug, this.state.starterSettings['builderType'] );
																		}
																	} }>
																		{ __( 'Skip, Start Importing' ) }
																	</Button>
																</Fragment>
															) }
															{ this.state.showForm && this.state.isSubscribed && (
																<Fragment>
																	<Button className="kt-defaults-save" isPrimary disabled={ this.state.isFetching } onClick={ () => {
																		if ( this.state.removePast ) {
																			this.runRemovePast( item.slug, this.state.starterSettings['builderType'] );
																		} else {
																			this.runPluginInstall( item.slug, this.state.starterSettings['builderType'] );
																		}
																		} }>
																			{ __( 'Start Importing', 'kadence-starter-templates' ) }
																	</Button>
																</Fragment>
															) }
														</Fragment>
													) }
												</Fragment>
											) }
										</Fragment>
									) }
								</Fragment>
							) }
					</Modal>
				</Fragment>
			);
		}
		const KadencesSiteMode = () => {
			const item = this.state.activeTemplates[this.state.activeTemplate];
			return (
				// <div className="kst-grid-single-site">
				// 	<div className="kst-import-selection-item">
				// 		<div className="kst-import-selection-title">
				// 			<h2>{ __( 'Selected Page:', 'kadence-starter-templates' ) } <span>{ item.pages[this.state.selectedPage].title }</span></h2>
				// 		</div>
				// 		<div className="kst-import-selection">
				// 			<img src={ item.pages[this.state.selectedPage].image } alt={ item.pages[this.state.selectedPage].title } />
				// 		</div>
				// 	</div>
				<Fragment>
					<div className="kst-import-selection-options">
						<div className="kst-import-grid-title">
							<h2>{ __( 'Page Templates', 'kadence-starter-templates' ) }</h2>
						</div>
						<div className="templates-grid">
							{ map( item.pages, ( { title, id, thumbnail } ) => {
								return (
									<div className="kst-template-item">
										<Button
											key={ id }
											className="kst-import-btn"
											isSmall
											onClick={ () => this.selectedMode( id ) }
										>
											<LazyLoad offsetBottom={200}>
												<img src={ thumbnail } alt={ title } />
											</LazyLoad>
											<div className="demo-title">
												<h4>{ title } <span>{ __( 'View Details', 'kadence-starter-templates' ) }</span></h4>
											</div>
										</Button>
									</div>
								);
							} ) }
						</div>
						<div className="kst-import-selection-bottom">
							<Button className="kt-import-fullsite" isPrimary onClick={ () => this.selectedFullMode() }>
								{ __( 'Import Full Site', 'kadence-starter-templates' ) }
							</Button>
						</div>
					</div>
					{/* <div className="kst-import-selection-footer">
						<Button 
							className="kt-import-back"
							icon={ arrowLeft }
							onClick={ () => this.backToDash() }>
							{ __( 'Back', 'kadence-starter-templates' ) }
						</Button>
						<Button className="kt-import-fullsite" isPrimary onClick={ () => this.selectedFullMode() }>
							{ __( 'Import Full Site', 'kadence-starter-templates' ) }
						</Button>
						<ExternalLink className="components-button" href={ item.url }>{ __( 'Preview Site', 'kadence-starter-templates' ) }</ExternalLink>
					</div> */}
				</Fragment>
			);
		}
		const KadenceSitesGrid = () => {
			const control = this;
			return (
				<div className="templates-grid">
					{/* { map( ( this.state.starterSettings['builderType'] === 'elementor' ? this.state.etemplates : this.state.templates ), ( { name, key, slug, image, content, categories, keywords, pro, pages } ) => { */}
					{ Object.keys( this.state.activeTemplates ).map( function( key, index ) {
						const name = control.state.activeTemplates[key].name;
						const slug = control.state.activeTemplates[key].slug;
						const image = control.state.activeTemplates[key].image;
						const categories = control.state.activeTemplates[key].categories;
						const keywords = control.state.activeTemplates[key].keywords;
						const pro = control.state.activeTemplates[key].pro;
						const member = control.state.activeTemplates[key].member;
						const pages = control.state.activeTemplates[key].pages;
						if ( ( 'all' === control.state.category || categories.includes( control.state.category ) ) && ( ! control.state.search || ( keywords && keywords.some( x => x.toLowerCase().includes( control.state.search.toLowerCase() ) ) ) ) ) {
							return (
								<div className="kst-template-item">
									<Button
										key={ key }
										className="kst-import-btn"
										isSmall
										onClick={ () => ( 'custom' === control.state.starterSettings[ 'builderType' ] ? control.jumpToImport( slug ) : control.fullFocusMode( slug ) ) }
										//onClick={ () => control.fullFocusMode( slug ) }
									>
										<LazyLoad offsetBottom={200}>
											<img src={ pages && pages.home && pages.home.thumbnail ? pages.home.thumbnail : image } alt={ name } />
										</LazyLoad>
										<div className="demo-title">
											<h4>{ name }</h4>
										</div>
									</Button>
									{ undefined !== pro && pro && (
										<Fragment>
											<span className="kb-pro-template">{ __( 'Pro', 'kadence-starter-sites' ) }</span>
										</Fragment>
									) }
								</div>
							);
						}
					} ) }
				</div>
			);
		}
		const KadenceFinishedPage = () => {
			const item = this.state.activeTemplates[this.state.activeTemplate];
			return (
				<div className="kst-grid-single-site">
					<div className="kst-import-selection-item">
						<div className="kst-import-selection">
							<img src={ item.pages[this.state.selectedPage].image } alt={ item.pages[this.state.selectedPage].title } />
						</div>
					</div>
					<div className="kst-import-selection-options">
						<div className="kst-import-single-selection-options-wrap">
							<div className="kst-import-selection-title">
								<h2>{ __( 'Template:', 'kadence-starter-templates' ) } <span>{ item.name }</span><br></br> { __( 'Selected Page:', 'kadence-starter-templates' ) } <span>{ item.pages[this.state.selectedPage].title }</span></h2>
							</div>
							<div className="kst-import-grid-title">
								<h2>{ __( 'Import complete!', 'kadence-starter-templates' ) }</h2>
								<div class="kadence_starter_templates_finished">
									<div dangerouslySetInnerHTML={ { __html: this.state.response } } />
								</div>
							</div>
						</div>
					</div>
				</div>
			);
		}
		const KadenceFinished = () => {
			const item = this.state.activeTemplates[this.state.activeTemplate];
			return (
				<div className="kst-grid-single-site">
					<div className="kst-import-selection-item">
						<div className="kst-import-selection">
						<img src={ item.pages && item.pages['home'] && item.pages['home'].image ? item.pages['home'].image : item.image } />
						</div>
					</div>
					<div className="kst-import-selection-options">
						<div className="kst-import-single-selection-options-wrap">
							<div className="kst-import-selection-title">
								<h2>{ __( 'Template:', 'kadence-starter-templates' ) } <span>{ item.name }</span></h2>
							</div>
							<div className="kst-import-grid-title">
								<h2>{ __( 'Import complete!', 'kadence-starter-templates' ) }</h2>
								<div class="kadence_starter_templates_finished">
									<div dangerouslySetInnerHTML={ { __html: this.state.response } } />
								</div>
							</div>
						</div>
					</div>
				</div>
			);
		}

		const MainPanel = () => (
			<Fragment>
				{ errorMessageShow ? (
					<div className="main-panel">
						<div className="kst-overlay-saving">
							{ ! this.state.errorTemplates && (
								<Spinner />
							) }
							{ this.state.errorTemplates && (
								<Fragment>
									<h2 style={{ textAlign:'center' } }>
										{ __( 'Error, Unable to access template database, please try re-downloading', 'kadence-starter-templates' ) }
									</h2>
									<div style={{ textAlign:'center' } }>
										<Button 
											className="kt-reload-templates"
											icon={ update }
											onClick={ () => this.reloadTemplateData() }
										>
											{ __( ' Sync with Cloud', 'kadence-starter-templates' ) }
										</Button>
									</div>
								</Fragment>
							) }
							{ false === this.state.activeTemplates && (
								<Fragment>{ this.loadTemplateData() }</Fragment>
							) }
						</div>
					</div>
				) : (
					<div className="main-panel">
						{ this.state.focusMode && (
							<Fragment>
								{ this.state.isImporting && (
									<Fragment>
										{ ! this.state.isPageSelected ? (
											<KadenceImportMode />
										) : (
											<KadenceImportSingleMode />
										) }
									</Fragment>
								) }
								{ ! this.state.isImporting && this.state.isSelected && (
									<KadenceImporterFullPreview
										item={ this.state.activeTemplates[this.state.activeTemplate] }
										colorPalette={ this.state.colorPalette }
										fontPair={ this.state.fontPair }
										onChange={ ( value ) => {
											this.setState( value );
										} }
									/>
								) }
								{ ! this.state.isImporting && ! this.state.isSelected && (
									<KadencesSiteMode />
								) }
							</Fragment>
						) }
						{ ! this.state.focusMode && ! this.state.finished && (
							<KadenceSitesGrid />
						) }
						{ this.state.finished && (
							<Fragment>
								{ ! this.state.isPageSelected ? (
									<KadenceFinished />
								) : (
									<KadenceFinishedPage />
								) }
							</Fragment>
						) }
					</div>
				) }
			</Fragment>
		);
		const ChooseBuilder = () => (
			<div className={ `kst-choose-builder-wrap${ ( kadenceStarterParams.ctemplates ? ' adjust-to-three-column' : '' ) }` }>
				<div className="kst-choose-builder-center">
					<h2 className="kst-choose-builder-title">{ __( 'Choose a Builder', 'kadence-starter-templates' ) }</h2>
					<div className="kst-choose-builder-inner">
						{ kadenceStarterParams.ctemplates && (
							<Button
								icon={ ( kadenceStarterParams.custom_icon ? <img className="custom-image-icon-src" src={ kadenceStarterParams.custom_icon } /> : cIcon ) }
								className="kt-import-select-type"
								onClick={ () => {
									this.saveConfig( 'builderType', 'custom' );
								} }
							>
								{ ( kadenceStarterParams.custom_name ? kadenceStarterParams.custom_name : __( 'Pro Designs', 'kadence-starter-templates' ) ) }
							</Button>
						) }
						<Button
							icon={ gbIcon }
							className="kt-import-select-type"
							onClick={ () => {
								this.saveConfig( 'builderType', 'blocks' );
							} }
						>
							{ __( 'Gutenberg', 'kadence-starter-templates' ) }
						</Button>
						<Button
							icon={ eIcon }
							className="kt-import-select-type"
							onClick={ () => {
								this.saveConfig( 'builderType', 'elementor' );
							} }
						>
							{ __( 'Elementor', 'kadence-starter-templates' ) }
						</Button>
					</div>
					{ this.state.isSaving && (
						<div className="kst-overlay-saving">
							<Spinner />
						</div>
					) }
				</div>
			</div>
		);
		return (
			<Fragment>
				<div class="kadence_theme_dash_head">
					<div class="kadence_theme_dash_head_container">
						<div class="kadence_theme_dash_logo">
							<img src={ this.state.logo }/>
						</div>
						{ this.state.focusMode && (
							<div class="kadence_theme_dash_back">
								{ this.state.isPageSelected ? (
									<Tooltip text={ __( 'Back to Individual Pages Grid' ) }>
										<Button
											className="kt-import-back"
											icon={ chevronLeft }
											onClick={ () => this.state.isFetching ? false : this.setState( { colorPalette: '', finished:false, selectedPage: 'home', focusMode: true, isSelected: false, isPageSelected:false, isImporting: false, progress: '' } ) }
										>
										</Button>
									</Tooltip>
								) : (
									<Tooltip text={ __( 'Back to Starter Templates Grid' ) }>
										<Button 
											className="kt-import-back"
											icon={ chevronLeft }
											onClick={ () => this.backToDash() }
										/>
									</Tooltip>
								) }
							</div>
						) }
						{ this.state.finished && (
							<div class="kadence_theme_dash_back">
								<Tooltip text={ __( 'Back to Starter Templates Grid' ) }>
									<Button 
										className="kt-import-back"
										icon={ chevronLeft }
										onClick={ () => this.backToDash() }
									/>
								</Tooltip>
							</div>
						) }
						<div class="kadence_starter_builder_type">
							{ this.state.starterSettings && this.state.starterSettings['builderType'] && (
								<Dropdown
									className="my-container-class-name"
									contentClassName="kst-type-popover"
									position="bottom left"
									renderToggle={ ( { isOpen, onToggle } ) => (
										<Button onClick={ onToggle } aria-expanded={ isOpen } icon={ builderTypeIcon } >
											{ builderTypeName }
											<Icon className="kst-chev" icon={ chevronDown } />
										</Button>
									) }
									renderContent={ ( { isOpen, onToggle } ) => (
										<div>
											<MenuItem
												icon={ gbIcon }
												className={ ( 'blocks' === this.state.starterSettings['builderType'] ? 'active-item' : '' ) }
												isSelected={ ( 'blocks' === this.state.starterSettings['builderType'] ? true : false ) }
												onClick={ () => {
													this.saveConfig( 'builderType', 'blocks' );
													this.setState( { activeTemplate: '', activePlugins:false, colorPalette: '', finished:false, selectedPage: 'home', focusMode: false, isSelected: false, isPageSelected:false, isImporting: false, progress: '', activeTemplates: false } );
													onToggle();
												} }
											>
												{ __( 'Gutenberg', 'kadence-starter-templates' ) }
											</MenuItem>
											<MenuItem
												icon={ eIcon }
												className={ ( 'elementor' === this.state.starterSettings['builderType'] ? 'active-item' : '' ) }
												isSelected={ ( 'elementor' === this.state.starterSettings['builderType'] ? true : false ) }
												onClick={ () => {
													this.saveConfig( 'builderType', 'elementor' );
													this.setState( { activeTemplate: '', activePlugins:false, colorPalette: '', finished:false, selectedPage: 'home', focusMode: false, isSelected: false, isPageSelected:false, isImporting: false, progress: '', activeTemplates: false } );
													onToggle();
												} }
											>
												{ __( 'Elementor', 'kadence-starter-templates' ) }
											</MenuItem>
											{ kadenceStarterParams.ctemplates && (
												<MenuItem
													icon={ ( kadenceStarterParams.custom_icon ? <img className="custom-image-icon-src" src={ kadenceStarterParams.custom_icon } /> : cIcon ) }
													className={ ( 'custom' === this.state.starterSettings['builderType'] ? 'active-item' : '' ) }
													isSelected={ ( 'custom' === this.state.starterSettings['builderType'] ? true : false ) }
													onClick={ () => {
														this.saveConfig( 'builderType', 'custom' );
														this.setState( { activeTemplate: '', activePlugins:false, colorPalette: '', finished:false, selectedPage: 'home', focusMode: false, isSelected: false, isPageSelected:false, isImporting: false, progress: '', activeTemplates: false } );
														onToggle();
													} }
												>
													{ ( kadenceStarterParams.custom_name ? kadenceStarterParams.custom_name : __( 'Pro Designs', 'kadence-starter-templates' ) ) }
												</MenuItem>
											) }
										</div>
									) }
								/>
							) }
						</div>
						{ false !== this.state.activeTemplates && this.state.starterSettings['builderType'] && (
							<div class="kadence_theme_dash_reload">
								<Tooltip text={ __( 'Sync with Cloud' ) }>
									<Button 
										className="kt-reload-templates"
										icon={ update }
										onClick={ () => this.reloadTemplateData() }
									/>
								</Tooltip>
							</div>
						) }
					</div>
				</div>
				<div class="kadence_theme_starter_dash_inner">
					{ this.state.starterSettings && this.state.starterSettings['builderType'] ? (
						<MainPanel />
					) : (
						<ChooseBuilder />
					) }
				</div>
			</Fragment>
		);
	}
}

wp.domReady( () => {
	render(
		<KadenceImporter />,
		document.querySelector( '.kadence_starter_dashboard_main' )
	);
} );
