/**
 * Internal dependencies
 */
import HelpTab from './help';
import ChangelogTab from './changelog';
import ProSettings from './pro-extension';
import RecommendedTab from './recomended';
import StarterTab from './starter';
import Sidebar from './sidebar';
import CustomizerLinks from './customizer';
import Notices from './notices';

/**
 * WordPress dependencies
 */
const { __, sprintf } = wp.i18n;
const { registerCoreBlocks } = wp.blockLibrary;
const { hasFilter } = wp.hooks;
const { Fragment, Component, RawHTML, render } = wp.element;
const { TabPanel, Panel, PanelBody, PanelRow, Button } = wp.components;

class KadenceDashboard extends Component {
	render() {
		const tabs = [
			{
				name: 'dashboard',
				title: __( 'Dashboard', 'kadence' ),
				className: 'kadence-dash-tab',
			},
			{
				name: 'help',
				title: __( 'Getting Started', 'kadence' ),
				className: 'kadence-help-tab',
			},
			{
				name: 'changelog',
				title: __( 'Changelog', 'kadence' ),
				className: 'kadence-changelog-tab',
			},
			// {
			// 	name: 'recommended',
			// 	title: __( 'Recommended Plugins', 'kadence' ),
			// 	className: 'kadence-recommended-tab',
			// },
			{
				name: 'starter',
				title: __( 'Starter Templates', 'kadence' ),
				className: 'kadence-starter-tab',
			},
		];

		const KadenceDashTabPanel = () => (
			<TabPanel className="kadence-dashboard-tab-panel"
				activeClass="active-tab"
				tabs={ tabs }>
				{
					( tab ) => {
						switch ( tab.name ) {
							case 'dashboard':
								return (
									<Panel className="dashboard-section tab-section">
										<PanelBody
											opened={ true }
										>
											<div className="dashboard-modules-wrapper">
												<div className="dashboard-customizer-settings">
													<CustomizerLinks />
												</div>
												<div className="dashboard-pro-settings">
													<ProSettings />
												</div>
											</div>
										</PanelBody>
									</Panel>
								);

							case 'help':
								return (
									<Panel className="help-section tab-section">
										<PanelBody
											opened={ true }
										>
											<HelpTab />
										</PanelBody>
									</Panel>
								);
							case 'changelog':
								return (
									<Panel className="changelog-section tab-section">
										<PanelBody
											opened={ true }
										>
											<ChangelogTab />
										</PanelBody>
									</Panel>
								);

							case 'recommended':
								return (
									<Panel className="recommended-section tab-section">
										<PanelBody
											opened={ true }
										>
											<RecommendedTab />
										</PanelBody>
									</Panel>
								);

							case 'starter':
								return (
									<Panel className="starter-section tab-section">
										<PanelBody
											opened={ true }
										>
											<StarterTab />
										</PanelBody>
									</Panel>
								);
						}
					}
				}
			</TabPanel>
		);

		const MainPanel = () => (
			<div className="tab-panel">
				<KadenceDashTabPanel />
			</div>
		);

		return (
			<Fragment>
				<MainPanel />
				<Notices />
			</Fragment>
		);
	}
}

wp.domReady( () => {
	render(
		<KadenceDashboard />,
		document.querySelector( '.kadence_theme_dashboard_main' )
	);
} );
