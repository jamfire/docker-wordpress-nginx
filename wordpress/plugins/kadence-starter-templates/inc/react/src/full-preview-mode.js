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
import map from 'lodash/map';
import LazyLoad from 'react-lazy-load';
/**
 * WordPress dependencies
 */
const { __, sprintf } = wp.i18n;
const { Fragment, Component, render, PureComponent } = wp.element;
const { Modal, Spinner, ButtonGroup, Dropdown, Button, ExternalLink, ToolbarGroup, MenuItem, Tooltip } = wp.components;

class KadenceImporterFullPreview extends Component {
	constructor() {
		super( ...arguments );
		this.state = {
			colorPalette: this.props.colorPalette ? this.props.colorPalette : '',
			fontPair: this.props.fontPair ? this.props.fontPair : '',
			palettes: ( kadenceStarterParams.palettes ? kadenceStarterParams.palettes : [] ),
			fonts: ( kadenceStarterParams.fonts ? kadenceStarterParams.fonts : [] ),
		};
	}
	capitalizeFirstLetter( string ) {
		return string.charAt( 0 ).toUpperCase() + string.slice( 1 );
	}
	render() {
		//console.log( this.props.item );
		const item = this.props.item;
		let pluginsActive = true;
		let pluginsPremium = false;
		let pluginsMember = false;
		return (
			<div className="kadence-starter-templates-preview theme-install-overlay wp-full-overlay expanded" style={ { display:'block' } }>
				<div className="wp-full-overlay-sidebar">
					<div className="wp-full-overlay-header">
						<button
							className="kst-close-focus-btn close-full-overlay"
							onClick={ () => this.props.onChange( { activeTemplate: '', colorPalette: '', fontPair: '', focusMode: false } ) }
						>
						</button>
					</div>
					<div className="wp-full-overlay-sidebar-content">
						<div className="install-theme-info">
							<div className="theme-info-wrap">
								<img className="theme-screenshot" src={ item.image } alt={ item.name } />
								<div className="theme-info-title-wrap">
									<h3 className="theme-name">{ item.name }</h3>
									<div className="theme-by">{ item.categories.map( category => this.capitalizeFirstLetter( category ) ).join( ', ' ) }</div>
								</div>
							</div>
							<div className="palette-title-wrap">
								<h2 className="palette-title">{__( 'Optional: Change Color Scheme', 'kadence-starter-templates' ) }</h2>
								<Button
									label={ __( 'clear' ) }
									className="kst-clear-palette"
									disabled={ this.state.colorPalette ? false : true }
									icon="image-rotate"
									iconSize={ 10 }
									onClick={ () => {
										this.setState( { colorPalette: '' } );
										document.getElementById('kadence-starter-preview').contentWindow.postMessage({ color: '' }, '*' );
									} }
								/>
							</div>
							<ButtonGroup className="kst-palette-group" aria-label={ __( 'Select a Palette', 'kadence-starter-templates' ) }>
								{ map( this.state.palettes, ( { palette, colors } ) => {
									return (
										<Button
											className="kst-palette-btn"
											isPrimary={ palette === this.state.colorPalette }
											aria-pressed={ palette === this.state.colorPalette }
											onClick={ () => {
												document.getElementById('kadence-starter-preview').contentWindow.postMessage({ color: palette }, '*' );
												this.setState( { colorPalette: palette } );
											} }
										>
											<span className={ 'kst-palette-bg' } style={ { 
												background: colors[4] ? colors[4] : undefined,
											} }></span>
											{ map( colors, ( color, index ) => {
												if ( 4 === index ) {
													return;
												}
												return (
													<div key={ index } style={ {
														width: 30,
														height: 30,
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
										</Button>
									)
								} ) }
							</ButtonGroup>
							<p className="desc-small">{__( '*You can change this after import.', 'kadence-starter-templates' ) }</p>
							<div className="font-title-wrap">
								<h2 className="font-title">{__( 'Optional: Change Font Family', 'kadence-starter-templates' ) }</h2>
								<Button
									label={ __( 'clear' ) }
									className="kst-clear-font"
									disabled={ this.state.fontPair ? false : true }
									icon="image-rotate"
									iconSize={ 10 }
									onClick={ () => {
										this.setState( { fontPair: '' } );
										document.getElementById('kadence-starter-preview').contentWindow.postMessage({ font: '' }, '*' );
									} }
								/>
							</div>
							<ButtonGroup className="kst-font-group" aria-label={ __( 'Select a Font', 'kadence-starter-templates' ) }>
								{ map( this.state.fonts, ( { font, img, name } ) => {
									return (
										<Tooltip text={ name }>
											<Button
												className={ `kst-font-btn${ font === this.state.fontPair ? ' active' : '' }` }
												aria-pressed={ font === this.state.fontPair }
												onClick={ () => {
													this.setState( { fontPair: font } );
													document.getElementById('kadence-starter-preview').contentWindow.postMessage({ font: font }, '*' );
												} }
											>
												<img src={ img } className="font-pairing" />
											</Button>
										</Tooltip>
									)
								} ) }
							</ButtonGroup>
							<p className="desc-small">{__( '*You can change this after import.', 'kadence-starter-templates' ) }</p>
						</div>
						<div className="kadence-starter-required-plugins">
							<h2 className="kst-required-title">{ __( 'Required Plugins', 'kadence-starter-templates' ) }</h2>
							<ul className="kadence-required-wrap">
								{ map( item.plugins, ( slug ) => {
									if ( kadenceStarterParams.plugins[ slug ] ) {
										if ( 'active' !== kadenceStarterParams.plugins[ slug ].state ) {
											pluginsActive = false;
											if ( 'thirdparty' === kadenceStarterParams.plugins[ slug ].src ) {
												pluginsPremium = true;
											}
											if ( 'bundle' === kadenceStarterParams.plugins[ slug ].src ) {
												pluginsMember = true;
											}
										}
										return (
											<li className={ `plugin-required${ ( 'active' !== kadenceStarterParams.plugins[ slug ].state && 'bundle' === kadenceStarterParams.plugins[ slug ].src ? ' bundle-install-required' : '' ) }` }>
												{ kadenceStarterParams.plugins[ slug ].title } - <span class="plugin-status">{ ( 'notactive' === kadenceStarterParams.plugins[ slug ].state ? __( 'Not Installed', 'kadence-starter-templates' ) : kadenceStarterParams.plugins[ slug ].state ) }</span>
											</li>
										);
									}
								} ) }
							</ul>
							{ ! pluginsActive && (
								<Fragment>
									{ ( pluginsPremium || pluginsMember ) && (
										<p className="desc-small">{__( '*Install Missing/Inactive Premium plugins to import.', 'kadence-starter-templates' ) }</p>
									) }
									{ ! pluginsPremium && ! pluginsMember && (
										<p className="desc-small">{__( '*Missing/Inactive plugins will be installed on import.', 'kadence-starter-templates' ) }</p>
									) }
								</Fragment>
							) }
							{ undefined !== item.pro && item.pro && ! item.member && (
								<div className="notice inline notice-alt notice-warning kadence-pro-notice">
									<p><strong>Kadence Pro Starter Site</strong></p>
									<p>To import this starter template you need to install Kadence Pro and Kadence Blocks Pro and activate your license using a <strong>Essential or Full Bundle license</strong>.</p>
								</div>
							) }
						</div>
					</div>

					<div class="wp-full-overlay-footer">
						{ undefined !== item.pro && item.pro && ! item.member ? (
							<div className="kt-upgrade-notice">
								<h2 className="kst-import-options-title">{ __( 'Kadence Bundle is required', 'kadence-starter-sites' ) } </h2>
								<ExternalLink className="kst-upgrade button-hero button button-primary" href={ 'https://www.kadencewp.com/pricing/' }>{ __( 'Get Pro Starter Site', 'kadence-starter-sites' ) }</ExternalLink>
							</div>
						) : (
							<Fragment>
								<h2 className="kst-import-options-title">{ __( 'Import Options', 'kadence-starter-templates' ) }</h2>
								<div class="kadence-starter-templates-preview-actions">
									<button
										className="kst-import-btn button-hero button"
										isDisabled={ undefined !== item.pro && item.pro && 'true' !== kadenceStarterParams.pro }
										onClick={ () => this.props.onChange( { isSelected: false, fontPair: this.state.fontPair, colorPalette: this.state.colorPalette } ) }
									>
										{ __( 'Single Page', 'kadence-starter-templates' ) }
									</button>
									<button
										className="kst-import-btn button-hero button button-primary"
										isDisabled={ undefined !== item.pro && item.pro && 'true' !== kadenceStarterParams.pro }
										onClick={ () => this.props.onChange( { isImporting: true, fontPair: this.state.fontPair, colorPalette: this.state.colorPalette } ) }
									>
										{ __( 'Full Site', 'kadence-starter-templates' ) }
									</button>
								</div>
							</Fragment>
						) }
					</div>
				</div>

				<div class="wp-full-overlay-main">
					<iframe id="kadence-starter-preview" src={ item.url + '?cache=bust' } />
				</div>
			</div>
		);
	}
}
export default KadenceImporterFullPreview;