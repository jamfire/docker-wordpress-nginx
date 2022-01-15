<?php
/**
 * Adds the author meta for use in the Kadence Theme Author box.
 *
 * Used in the Kadence Theme
 *
 * @since 1.0.4
* @package Kadence Starter Templates
 */

namespace Kadence_Starter_Templates;

/**
 * Adds and Saves extra profile fields for author box.
 */
class Author_Meta {

	/**
	 * @var null
	 */
	private static $instance = null;
	/**
	 * Instance Control
	 */
	public static function get_instance() {
		if ( is_null( self::$instance ) ) {
			self::$instance = new self();
		}
		return self::$instance;
	}
	/**
	 * Class constructor
	 *
	 * @access public
	 * @return void
	 */
	public function __construct() {
		add_action( 'show_user_profile', array( $this, 'extra_profile_fields' ) );
		add_action( 'edit_user_profile', array( $this, 'extra_profile_fields' ) );
		add_action( 'personal_options_update', array( $this, 'save_extra_profile_fields' ) );
		add_action( 'edit_user_profile_update', array( $this, 'save_extra_profile_fields' ) );
	}
	/**
	 * Adds extra profile fields for author box.
	 *
	 * @param object $user the user object.
	 */
	public function extra_profile_fields( $user ) {
		if ( current_user_can( 'edit_posts' ) && current_user_can( 'edit_user', $user->ID ) ) {
			?>
			<?php wp_nonce_field( 'kadence-profile-extras', 'kadence-profile-nonce' ); ?>
			<h3><?php echo esc_html__( 'Extra profile information for author box', 'kadence' ); ?></h3>
			<table class="form-table">
				<tr>
					<th>
						<label for="occupation">
							<?php esc_html_e( 'Occupation', 'kadence' ); ?>
						</label>
					</th>
					<td>
						<input type="text" name="occupation" id="occupation" value="<?php echo esc_attr( get_the_author_meta( 'occupation', $user->ID ) ); ?>" class="regular-text" /><br />
						<span class="description"><?php esc_html_e( 'Please enter your Occupation.', 'kadence' ); ?></span>
					</td>
				</tr>
				<tr>
					<th>
						<label for="facebook">Facebook</label></th>
					<td>
						<input type="text" name="facebook" id="facebook" value="<?php echo esc_attr( get_the_author_meta( 'facebook', $user->ID ) ); ?>" class="regular-text" /><br />
						<span class="description"><?php esc_html_e( 'Please enter your Facebook url. (be sure to include https://)', 'kadence' ); ?></span>
					</td>
				</tr>
				<tr>
					<th>
						<label for="twitter">Twitter</label>
					</th>
					<td>
						<input type="text" name="twitter" id="twitter" value="<?php echo esc_attr( get_the_author_meta( 'twitter', $user->ID ) ); ?>" class="regular-text" /><br />
						<span class="description"><?php esc_html_e( 'Please enter your Twitter url. (be sure to include https://)', 'kadence' ); ?></span>
					</td>
				</tr>
				<tr>
					<th>
						<label for="instagram">Instagram</label>
					</th>
					<td>
						<input type="text" name="instagram" id="instagram" value="<?php echo esc_attr( get_the_author_meta( 'instagram', $user->ID ) ); ?>" class="regular-text" /><br />
						<span class="description"><?php esc_html_e( 'Please enter your Instagram url. (be sure to include https://)', 'kadence' ); ?></span>
					</td>
				</tr>
				<tr>
					<th>
						<label for="youtube">YouTube</label>
					</th>
					<td>
						<input type="text" name="youtube" id="youtube" value="<?php echo esc_attr( get_the_author_meta( 'youtube', $user->ID ) ); ?>" class="regular-text" /><br />
						<span class="description"><?php esc_html_e( 'Please enter your YouTube url. (be sure to include https://)', 'kadence' ); ?></span>
					</td>
				</tr>
				<tr>
					<th>
						<label for="flickr">Flickr</label>
					</th>
					<td>
						<input type="text" name="flickr" id="flickr" value="<?php echo esc_attr( get_the_author_meta( 'flickr', $user->ID ) ); ?>" class="regular-text" /><br />
						<span class="description"><?php esc_html_e( 'Please enter your Flickr url. (be sure to include https://)', 'kadence' ); ?></span>
					</td>
				</tr>
				<tr>
					<th>
						<label for="vimeo">Vimeo</label>
					</th>
					<td>
						<input type="text" name="vimeo" id="vimeo" value="<?php echo esc_attr( get_the_author_meta( 'vimeo', $user->ID ) ); ?>" class="regular-text" /><br />
						<span class="description"><?php esc_html_e( 'Please enter your Vimeo url. (be sure to include https://)', 'kadence' ); ?></span>
					</td>
				</tr>
				<tr>
					<th>
						<label for="linkedin">Linkedin</label>
					</th>
					<td>
						<input type="text" name="linkedin" id="linkedin" value="<?php echo esc_attr( get_the_author_meta( 'linkedin', $user->ID ) ); ?>" class="regular-text" /><br />
						<span class="description"><?php esc_html_e( 'Please enter your Linkedin url. (be sure to include https://)', 'kadence' ); ?></span>
					</td>
				</tr>
				<tr>
					<th>
						<label for="dribbble">Dribbble</label>
					</th>
					<td>
						<input type="text" name="dribbble" id="dribbble" value="<?php echo esc_attr( get_the_author_meta( 'dribbble', $user->ID ) ); ?>" class="regular-text" /><br />
						<span class="description"><?php esc_html_e( 'Please enter your Dribbble url. (be sure to include https://)', 'kadence' ); ?></span>
					</td>
				</tr>
				<tr>
					<th>
						<label for="pinterest">Pinterest</label>
					</th>
					<td>
						<input type="text" name="pinterest" id="pinterest" value="<?php echo esc_attr( get_the_author_meta( 'pinterest', $user->ID ) ); ?>" class="regular-text" /><br />
						<span class="description"><?php esc_html_e( 'Please enter your Pinterest url. (be sure to include https://)', 'kadence' ); ?></span>
					</td>
				</tr>
				<tr>
					<th>
						<label for="amazon">Amazon</label>
					</th>
					<td>
						<input type="text" name="amazon" id="amazon" value="<?php echo esc_attr( get_the_author_meta( 'amazon', $user->ID ) ); ?>" class="regular-text" /><br />
						<span class="description"><?php esc_html_e( 'Please enter your Amazon url. (be sure to include https://)', 'kadence' ); ?></span>
					</td>
				</tr>
				<tr>
					<th>
						<label for="medium">Medium</label>
					</th>
					<td>
						<input type="text" name="medium" id="medium" value="<?php echo esc_attr( get_the_author_meta( 'medium', $user->ID ) ); ?>" class="regular-text" /><br />
						<span class="description"><?php esc_html_e( 'Please enter your Medium url. (be sure to include https://)', 'kadence' ); ?></span>
					</td>
				</tr>
				<tr>
					<th>
						<label for="goodreads">Goodreads</label>
					</th>
					<td>
						<input type="text" name="goodreads" id="goodreads" value="<?php echo esc_attr( get_the_author_meta( 'goodreads', $user->ID ) ); ?>" class="regular-text" /><br />
						<span class="description"><?php esc_html_e( 'Please enter your Goodreads url. (be sure to include https://)', 'kadence' ); ?></span>
					</td>
				</tr>
				<tr>
					<th>
						<label for="bookbub">BookBub</label>
					</th>
					<td>
						<input type="text" name="bookbub" id="bookbub" value="<?php echo esc_attr( get_the_author_meta( 'bookbub', $user->ID ) ); ?>" class="regular-text" /><br />
						<span class="description"><?php esc_html_e( 'Please enter your BookBub url. (be sure to include https://)', 'kadence' ); ?></span>
					</td>
				</tr>
			</table>
			<?php
		}
	}
	/**
	 * Saves extra profile fields for author box.
	 *
	 * @param number $user_id the user id.
	 */
	public function save_extra_profile_fields( $user_id ) {
		if ( ! current_user_can( 'edit_posts' ) || ! current_user_can( 'edit_user', $user_id ) ) {
			return false;
		}
		if ( ! isset( $_POST['kadence-profile-nonce'] ) || ! wp_verify_nonce( sanitize_key( $_POST['kadence-profile-nonce'] ), 'kadence-profile-extras' ) ) {
			return;
		}
		if ( isset( $_POST['occupation'] ) ) {
			update_user_meta( $user_id, 'occupation', sanitize_text_field( wp_unslash( $_POST['occupation'] ) ) );
		}
		if ( isset( $_POST['twitter'] ) ) {
			update_user_meta( $user_id, 'twitter', esc_url_raw( $_POST['twitter'] ) ); // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.MissingUnslash
		}
		if ( isset( $_POST['facebook'] ) ) {
			update_user_meta( $user_id, 'facebook', esc_url_raw( $_POST['facebook'] ) ); // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.MissingUnslash
		}
		if ( isset( $_POST['youtube'] ) ) {
			update_user_meta( $user_id, 'youtube', esc_url_raw( $_POST['youtube'] ) ); // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.MissingUnslash
		}
		if ( isset( $_POST['flickr'] ) ) {
			update_user_meta( $user_id, 'flickr', esc_url_raw( $_POST['flickr'] ) ); // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.MissingUnslash
		}
		if ( isset( $_POST['vimeo'] ) ) {
			update_user_meta( $user_id, 'vimeo', esc_url_raw( $_POST['vimeo'] ) ); // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.MissingUnslash
		}
		if ( isset( $_POST['linkedin'] ) ) {
			update_user_meta( $user_id, 'linkedin', esc_url_raw( $_POST['linkedin'] ) ); // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.MissingUnslash
		}
		if ( isset( $_POST['dribbble'] ) ) {
			update_user_meta( $user_id, 'dribbble', esc_url_raw( $_POST['dribbble'] ) ); // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.MissingUnslash
		}
		if ( isset( $_POST['pinterest'] ) ) {
			update_user_meta( $user_id, 'pinterest', esc_url_raw( $_POST['pinterest'] ) ); // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.MissingUnslash
		}
		if ( isset( $_POST['instagram'] ) ) {
			update_user_meta( $user_id, 'instagram', esc_url_raw( $_POST['instagram'] ) ); // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.MissingUnslash
		}
		if ( isset( $_POST['goodreads'] ) ) {
			update_user_meta( $user_id, 'goodreads', esc_url_raw( $_POST['goodreads'] ) ); // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.MissingUnslash
		}
		if ( isset( $_POST['amazon'] ) ) {
			update_user_meta( $user_id, 'amazon', esc_url_raw( $_POST['amazon'] ) ); // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.MissingUnslash
		}
		if ( isset( $_POST['medium'] ) ) {
			update_user_meta( $user_id, 'medium', esc_url_raw( $_POST['medium'] ) ); // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.MissingUnslash
		}
		if ( isset( $_POST['bookbub'] ) ) {
			update_user_meta( $user_id, 'bookbub', esc_url_raw( $_POST['bookbub'] ) ); // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.MissingUnslash
		}
	}
}
Author_Meta::get_instance();
