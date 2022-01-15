import RowLayoutComponent from './row-layout-component';

export const RowControl = wp.customize.KadenceControl.extend( {
	renderContent: function renderContent() {
		let control = this;
		ReactDOM.render(
				<RowLayoutComponent control={control} customizer={ wp.customize }/>,
				control.container[0]
		);
	}
} );
