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

class KadenceSubscribeForm extends Component {
	constructor() {
		super( ...arguments );
		this.state = {
			email: kadenceStarterParams.user_email,
			privacy: false,
			privacyError: false,
		};
	}
	render() {
		return (
			<div className={ 'kt-subscribe-form-box' }>
				<h2>{ __( 'Subscribe and Import', 'kadence-starter-templates' ) }</h2>
				<p>{ __( "Subscribe to learn about new starter templates and features for Kadence.", 'kadence-blocks' ) }</p>
				<TextControl
					type="text"
					className={ 'kt-subscribe-email-input' }
					label={ __( 'Email:', 'kadence-starter-templates' )  }
					value={ this.state.email }
					placeholder={ __( 'example@example.com', 'kadence-starter-templates' ) }
					onChange={ value => this.setState( { email: value } ) }
				/>
				{ this.props.emailError && (
					<span className="kb-subscribe-form-error">{ __( 'Invalid Email, Please enter a valid email.', 'kadence-starter-templates' ) }</span>
				) }
				<CheckboxControl
					label={ <Fragment>{ __( 'Accept', 'kadence-starter-templates' ) } <ExternalLink href={ 'https://www.kadencewp.com/privacy-policy/' }>{ __( 'Privacy Policy', 'kadence-starter-templates' ) }</ExternalLink></Fragment> }
					help={ __( 'We do not spam, unsubscribe anytime.', 'kadence-starter-templates' ) }
					checked={ this.state.privacy }
					onChange={ value => this.setState( { privacy: value } ) }
				/>
				{ this.state.privacyError && (
					<span className="kb-subscribe-form-error">{ __( 'Please Accept Privacy Policy', 'kadence-blocks' ) }</span>
				) }
				<Button className="kt-defaults-save" isPrimary onClick={ () => {
						if ( this.state.privacy ) {
							this.setState( { privacyError: false } );
							this.props.onRun( this.state.email );
						} else {
							this.setState( { privacyError: true } );
						}
					} }>
						{ __( 'Subscribe and Start Importing' ) }
				</Button>
			</div>
		);
	}
}
export default KadenceSubscribeForm;