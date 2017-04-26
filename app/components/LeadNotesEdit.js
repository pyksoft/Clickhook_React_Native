import React, {Component} from 'react';
import {
  StyleSheet,
  ActivityIndicator,
  Platform,
  View,
  RefreshControl,
  Text,
  TextInput,
  Image,
  AsyncStorage,
  TouchableHighlight,
  Modal,
  TouchableWithoutFeedback,
  ScrollView
} from 'react-native';
import {colors} from '../styles/styles';
import LeadNotesRow from './LeadNotesRow';
import Icon from 'react-native-vector-icons/Ionicons';
import TextField from 'react-native-md-textinput';
import Fab from './Fab';
import CancelSave from './helpers/CancelSave';

const validator = require('validator');

export default class LeadNotesEdit extends Component {

  constructor(props) {
    super(props);
    this.state = {note: false};
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.note !== nextProps.note) {
      this.setState({note: nextProps.note});
    }
  }

  render() {

    const styles = {
      top: {
        marginBottom: 4,
        shadowColor: "#000000",
        shadowOpacity: 0.4,
        shadowRadius: 2,
        shadowOffset: {height: 0, width: 0},
      },
      bottom: {
        marginTop: 4,
        shadowColor: "#000000",
        shadowOpacity: 0.4,
        shadowRadius: 2,
        shadowOffset: {height: 0, width: 0},
      },
      top_text: {
        textAlign: 'center',
        fontSize: 24,
        height: 92,
        padding: 32,
      },
      btn: {
        backgroundColor: this.props.create_loading ? colors.light : colors.brand,
        borderRadius: 3,
        margin: 24,
        width: 120,
      },
      btn_text: {
        flex: 1,
        color: '#fff',
        padding: 12,
        fontSize: 16,
        textAlign: 'center'
      }
    };

    let autocomplete_users = [];

    if (this.state.note) {
      let typing_name = this.state.note.match(/@\w*$/);
      if (typing_name && typing_name.length > 0) {
        typing_name = typing_name[0].trim().replace('@', '');
        this.props.users.forEach(user => {
          if (user.name.toLowerCase().indexOf(typing_name) !== -1) {
            autocomplete_users.push(
              <TouchableWithoutFeedback
                key={user.username}
                style={{flex: 1}}
                onPress={() => {
                this.setState({note: this.state.note.replace(/@\w*$/, `@${user.username} `)});
                this.refs.note.focus();
              }}
              >
                <View style={{padding: 6}}>
                  <Text style={{fontSize: 14}}>{user.name} - {user.email}</Text>
                </View>
              </TouchableWithoutFeedback>
            );
          }
        });
      }
    }

    return (
      <Modal
        animationType={"slide"}
        transparent={false}
        visible={this.props.visible}
      >
        <View style={{flex: 1}}>
          <View style={styles.top}>
            <Text style={styles.top_text}>
              Edit note
            </Text>
          </View>
          <TouchableWithoutFeedback style={{flex: 1}} onPress={() => {
            if(this.refs.note.isFocused() === false){
              this.refs.note.focus();
            }
          }}>
            <ScrollView style={{flex: 1, padding: 12}}>
              <View style={{height: 12}}></View>
              <TextField
                label={'Note'}
                ref={'note'}
                height={150}
                multiline={true}
                autoFocus={true}
                highlightColor={colors.brand}
                value={this.state.note || ''}
                onChangeText={note => this.setState({note})}
              />
              <View style={{top: 135}}>
                {autocomplete_users}
              </View>
            </ScrollView>
          </TouchableWithoutFeedback>
          <View style={styles.bottom}>
            <CancelSave
              handleSave={() => {
                let note = this.state.note;
                this.setState({note: false});
                this.props.handleSave(this.state.note, this.props.noteId);
              }}
              handleCancel={() => {
              this.setState({note: false});
                this.props.handleCancel();
              }}
              loading={false}
            />
          </View>
        </View>
      </Modal>
    );
  }
}

LeadNotesEdit.propTypes = {
  visible: React.PropTypes.bool.isRequired,
  note: React.PropTypes.string,
  users: React.PropTypes.array.isRequired,
  noteId: React.PropTypes.string,
  handleCancel: React.PropTypes.func.isRequired,
  handleSave: React.PropTypes.func.isRequired,
};
