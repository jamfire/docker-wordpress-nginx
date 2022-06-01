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
const { Modal, Spinner, ButtonGroup, Dropdown, Icon, Button, ExternalLink, ToolbarGroup, ToggleControl, MenuItem, Tooltip } = wp.components;

class KadenceSingleTemplateImport extends Component {
	constructor() {
		super( ...arguments );
		this.state = {
			colorPalette: this.props.colorPalette ? this.props.colorPalette : '',
			fontPair: this.props.fontPair ? this.props.fontPair : '',
			palettes: ( kadenceStarterParams.palettes ? kadenceStarterParams.palettes : [] ),
			fonts: ( kadenceStarterParams.fonts ? kadenceStarterParams.fonts : [] ),
			overrideColors: false,
			overrideFonts: false,
			isOpenCheckColor: false,
			isOpenCheckFont: false,
		};
	}
	capitalizeFirstLetter( string ) {
		return string.charAt( 0 ).toUpperCase() + string.slice( 1 );
	}
	render() {
		const item = this.props.item;
		let pluginsActive = true;
		let pluginsPremium = false;
		return (
			<div className="kst-grid-single-site">
				<div className="kst-import-selection-item">
					<div className="kst-import-selection">
						<img src={ item.pages[this.state.selectedPage].image.replace( '-scaled', '' ) } alt={ item.pages[this.state.selectedPage].title } />
					</div>
				</div>
				<div className="kst-import-selection-options">
					<div className="kst-import-single-selection-options-wrap">
						<div className="kst-import-selection-title">
							<h2>{ __( 'Template:', 'kadence-starter-templates' ) } <span>{ item.name }</span><br></br> { __( 'Selected Page:', 'kadence-starter-templates' ) } <span>{ item.pages[this.state.selectedPage].title }</span></h2>
						</div>
						<div className="kst-import-grid-title">
							<h2>{ __( 'Page Template Plugins', 'kadence-starter-templates' ) }</h2>
						</div>
							<ul className="kadence-required-wrap">
								{ map( item.plugins, ( slug ) => {
									if ( kadenceStarterParams.plugins[ slug ] ) {
										return (
											<li className="plugin-required">
												{ kadenceStarterParams.plugins[ slug ].title } - <span class="plugin-status">{ ( 'notactive' === kadenceStarterParams.plugins[ slug ].state ? __( 'Not Installed', 'kadence-starter-templates' ) : kadenceStarterParams.plugins[ slug ].state ) }</span> { ( 'active' !== kadenceStarterParams.plugins[ slug ].state && 'thirdparty' === kadenceStarterParams.plugins[ slug ].src ? <span class="plugin-install-required">{ __( 'Please install and activate this third-party premium plugin' ) }</span> : '' ) }
											</li>
										);
									}
								} ) }
							</ul>
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
											{ __( 'Override Colors', 'kadence-starter-templates' ) }
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
									<ExternalLink href={ 'https://www.kadencewp.com/kadence-theme/' }>{ __( 'Get Free Theme', 'kadence-starter-templates' ) }</ExternalLink>
								</div>
							) }
							{ kadenceStarterParams.isKadence && (
								<Fragment>
									<Button className="kt-defaults-save" isPrimary disabled={ this.state.isFetching } onClick={ () => {
											this.props.onChange( { isImporting: true, overrideColors: this.state.overrideColors, overrideFonts: this.state.overrideFonts } );
											this.props.runInstallSingle( item.slug, this.props.selectedPage );
										} }>
											{ __( 'Start Importing Page', 'kadence-starter-templates' ) }
									</Button>
								</Fragment>
							) }
					</div>
				</div>
			</div>
		);
	}
}
export default KadenceSingleTemplateImport;