import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Query } from 'react-apollo';
import FormProps from '../../../RenderProps/form-props';
import GET_GAME_DETAILS from '../../../GraphQL/Games/Queries/GET_GAME_DETAILS';
import CenteredActivityIndicator from '../../../Components/Common/CenteredActivityIndicator';
import CancelGame from '../../../Components/Games/CancelGame';
import CancelGameDoneModal from '../../../Components/Games/CancelGameDoneModal';
import {addModelState} from '../../../utils';

//------------------------------------------------------------------------------
// COMPONENT:
//------------------------------------------------------------------------------
class CancelGameScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    addModelState(this, 'cancelDone');
    console.log(this.modals);
  }

  get gameUUID() {
    const {navigation} = this.props;
    return navigation.state.params.uuid;
  }

  handleAttendeesPress = () => {
    const {navigation} = this.props;
    navigation.navigate('GamePlayerScreen', {uuid: this.gameUUID});
  }

  render() {
    const {user, navigation} = this.props;
    console.log(this.modals);
    const cancelDoneModal = this.modals.cancelDone;
    return (
      <FormProps>
        {({
            disabled,
            // errorMsg,
            // successMsg,
            handleBefore,
            handleClientError,
            handleServerError,
            handleSuccess,
          }) => (
          <Query
            query={GET_GAME_DETAILS}
            variables={{uuid: this.gameUUID}}
            fetchPolicy="network-only"
          >
            {({loading, error, data, refetch}) => {
              if (loading) {
                return <CenteredActivityIndicator/>;
              }
              if (error || !data || !data.game || data.game.status === 'CANCELED') {
                return null;
              }

              // Only display cancel form if user is the organizer of the activity
              const isOrganizer = (
                user &&
                user.uuid &&
                data.game.organizer &&
                data.game.organizer.uuid &&
                user.uuid === data.game.organizer.uuid
              );

              if (!isOrganizer) {
                return null;
              }

              return [
                <CancelGame
                  key="form"
                  game={data.game}
                  // Form props
                  disabled={disabled}
                  onBeforeHook={handleBefore}
                  onClientErrorHook={handleClientError}
                  onServerErrorHook={handleServerError}
                  onSuccessHook={() => {
                    // Extend FormProps.handleSuccess default functionality
                    handleSuccess(cancelDoneModal.show);
                  }}
                  // Other props
                  onAttendeesPress={this.handleAttendeesPress}
                />,
                <CancelGameDoneModal
                  key="modal"
                  visible={cancelDoneModal.isVisible}
                  onClose={() => {
                    cancelDoneModal.hide();
                    // Refetch activity data
                    refetch();
                    // Redirect user to activity display screen
                    navigation.goBack(null);
                  }}
                />,
              ];
            }}
          </Query>
        )}
      </FormProps>
    );
  }
}

CancelGameScreen.propTypes = {
  navigation: PropTypes.shape({
    state: PropTypes.shape({
      params: PropTypes.shape({
        uuid: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  }).isRequired,
  user: PropTypes.object, // eslint-disable-line
};

CancelGameScreen.defaultProps = {
  user: null,
};

// Redux integration
const mapStateToProps = ({ user }) => ({ user });
const withRedux = connect(mapStateToProps, null);

export default withRedux(CancelGameScreen);
