import React from 'react';
import { 
  Segment, 
  Header, 
  Form, 
  TextArea, 
  Button 
} from 'semantic-ui-react';
import { connect } from 'react-redux';
import axios from 'axios';
import { setFlash } from '../actions/flash';
import { addMessage, getMessages } from '../actions/messages';
import { startTyping, stopTyping } from '../actions/isTyping';
import ChatMessage from './ChatMessage';

class ChatWindow extends React.Component {
  state = { newMessage: '' }

  componentDidMount() {
    const { dispatch } = this.props;
    window.MessageBus.start()
    dispatch(setFlash('Welcome To My Chat App', 'green'))
    dispatch(getMessages());

    window.MessageBus.subscribe('/typing', (data) => {
      data.typing ? 
        dispatch(startTyping(data.id)) 
       :
        dispatch(stopTyping(data.id))
    })

    window.MessageBus.subscribe('/chat_channel', (data) => {
      dispatch(addMessage(JSON.parse(data)));
    });

  }

  componentWillUnmount() {
    window.MessageBus.unsubscribe('/chat_channel')
    window.MessageBus.unsubscribe('/typing')
  }

  byTime = (x,y) => {
    if (x.created_at > y.created_at)
      return 1
    if (x.created_at < y.created_at)
      return -1
    return 0
  }

  displayMessages = () => {
    const { messages } = this.props;

    if (messages.length)
      return messages.sort(this.byTime).map( (message, i) => {
        return <ChatMessage key={i} message={message} />
      })
    else
      return (
        <Segment inverted textAlign="center">
          <Header as="h1">No messages yes</Header>
        </Segment>
      )
  }

  startTyping = () => {
    axios.post('/api/typing', { typing: true })
      .then( ({ headers }) => this.props.dispatch({ type: 'HEADERS', headers }) )
  }

  stopTyping = () => {
    axios.post('/api/typing')
      .then( ({ headers }) => this.props.dispatch({ type: 'HEADERS', headers }) )
  }

  addMessage = (e) => {
    e.preventDefault();
    this.stopTyping();
    const { dispatch, user: { email }} = this.props;
    const { newMessage } = this.state;
    const message = { email, body: newMessage };

    axios.post('/api/messages', message)
      .then( ({ headers }) => {
        dispatch({ type: 'HEADERS', headers })
        this.setState({ newMessage: '' })
      })
      .catch( ({ headers }) => {
        dispatch({ type: 'HEADERS', headers })
        dispatch(setFlash('Error Posting Messages', 'red'))
      });
  }

  setMessage = (e) => {
    const { newMessage } = this.state;
    const { value } = e.target;
    if (newMessage && !value)
      this.stopTyping()
    else
      this.startTyping()
    this.setState({ newMessage: e.target.value })
  }

  render() {
    const { isTyping } = this.props;
    return (
      <Segment basic>
        <Header 
          as="h2" 
          textAlign="center"
          style={styles.underline}
        >
          React Chat
        </Header>
        <Segment basic style={styles.mainWindow}>
          <Segment basic>
            { this.displayMessages() }
            { isTyping.length > 0 && <Header as="h5">Someone is typing</Header> }
          </Segment>
        </Segment>
        <Segment style={styles.messageInput}>
          <Form onSubmit={this.addMessage}>
            <TextArea
              value={this.state.newMessage}
              onChange={this.setMessage}
              placeholder="Write something nice!"
              autoFocus
              required
            >
            </TextArea>
            <Segment basic textAlign="center">
              <Button type="submit" primary>Send Message</Button>
            </Segment>
          </Form>
        </Segment>
      </Segment>
    )
  }
}

const styles = {
  underline: { textDecoration: 'underline' },
  mainWindow: {
    border: '3px solid black',
    height: '60vh',
    overflowY: 'scroll',
    backgroundColor: 'lightgrey',
    borderRadius: '10px',
  },
  messageInput: {
    borderRadius: '10px',
    width: '80%',
    margin: '0 auto',
    padding: '10px',
  },
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    messages: state.messages,
    isTyping: state.isTyping,
  }
}

export default connect(mapStateToProps)(ChatWindow);