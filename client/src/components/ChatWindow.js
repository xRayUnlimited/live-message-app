import React from 'react';
import { Segment, Header, Form, TextArea, Button } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { setFlash } from '../actions/flash';
import { addMessage } from '../actions/messages';
import ChatMessage from './ChatMessage';

class ChatWindow extends React.Component {
  render() {
    return null
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    messages: state.message
  }
}

export default connect(mapStateToProps)(ChatWindow);