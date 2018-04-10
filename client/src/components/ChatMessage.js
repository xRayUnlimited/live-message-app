import React from 'react';
import { Segment, Divider } from 'semantic-ui-react';

const ChatMessage =({message }) => (
  <Segment>
    <i>{message.email}</i>
    <divider hidden />
    <blockquote>{message.body}</blockquote>
  </Segment>
)

export default ChatMessage;