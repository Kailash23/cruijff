import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { GiftedChat } from 'react-native-gifted-chat';
import I18n from '../../../I18n';
import { withUser, userPropTypes } from '../../../Context/User';
// import { TopLayout, BottomLayout } from '../../../Components/Layouts/FixedBottomLayout';
import ChatManagerProps from '../../../RenderProps/chat-manager-props';
// import Block from '../../../Components/Common/Block';
// import CenteredActivityIndicator from '../../../Components/Common/CenteredActivityIndicator';
// import ChatMsgList from '../../../Components/Chat/ChatMsgList';
import ChatDay from '../../../Components/Chat/ChatDay';
import ChatBubble from '../../../Components/Chat/ChatBubble';
import ChatInputToolbar from '../../../Components/Chat/ChatInputToolbar';
import ChatComposer from '../../../Components/Chat/ChatComposer';
import ChatSend from '../../../Components/Chat/ChatSend';

//------------------------------------------------------------------------------
// STYLE:
//------------------------------------------------------------------------------
const FlexOne = styled.View`
  flex: 1; /* full height */
`;
//------------------------------------------------------------------------------
// COMPONENT:
//------------------------------------------------------------------------------
const GameChatScreen = ({ user, navigation }) => {
  const { roomId } = navigation.state.params;
  console.log('USER', user);
  console.log('ROOM ID', roomId);
  console.log('I18N LOCALE', I18n.locale.substr(0, 2));

  return (
    <FlexOne>
      <ChatManagerProps userId="readonly" roomId={roomId}>
        {chatHandler => (
          <ChatManagerProps userId={user ? user.uuid : null}>
            {(userHandler) => {
              const disabled = !(user && user.uuid && !userHandler.loading);

              return (
                <GiftedChat
                  user={{ _id: user ? user.uuid : null }}
                  messages={chatHandler.messages}
                  inverted={false}
                  renderAvatarOnTop
                  isAnimated
                  // renderUsernameOnMessage
                  renderBubble={props => <ChatBubble {...props} />}
                  renderDay={props => <ChatDay {...props} locale={I18n.locale.substr(0, 2)} />}
                  renderInputToolbar={props => <ChatInputToolbar {...props} />}
                  minInputToolbarHeight={50}
                  renderComposer={props => <ChatComposer {...props} />}
                  placeholder={I18n.t('chatInputField.placeholder')}
                  textInputProps={{ editable: !disabled }}
                  renderSend={props => <ChatSend {...props} disabled={disabled} />}
                  alwaysShowSend
                  onSend={async (messages) => {
                    try {
                      await userHandler.chatkitUser.sendMessage({ text: messages[0].text, roomId });
                    } catch (exc) {
                      console.log(exc);
                      // onError({ text: [sanitizeChatkitServerError(exc)] });
                      // return;
                    }
                  }}
                />
              );
            }}
          </ChatManagerProps>
        )}
      </ChatManagerProps>
    </FlexOne>
  );
};

GameChatScreen.propTypes = {
  user: userPropTypes.user,
  navigation: PropTypes.shape({
    state: PropTypes.shape({
      params: PropTypes.shape({
        roomId: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  }).isRequired,
};

GameChatScreen.defaultProps = {
  user: null,
};

export default withUser(GameChatScreen);
