import FocusButtonComponent from './focus-button-component';

export const FocusButtonControl = wp.customize.KadenceControl.extend( {
	renderContent: function renderContent() {
		let control = this;
	ReactDOM.render( <FocusButtonComponent control={ control } customizer={ wp.customize } />, control.container[0] );
	}
} );
