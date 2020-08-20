import React, { Component } from 'react';
import { Text, View, ScrollView, FlatList, Modal, StyleSheet, Button, Alert, PanResponder } from 'react-native';
import { Card, Icon, Rating, Input} from 'react-native-elements';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import { postFavorite } from '../redux/ActionCreators';
import { postComment } from '../redux/ActionCreators';
import * as Animatable from 'react-native-animatable';


const mapStateToProps = state => {
  return {
    dishes: state.dishes,
    comments: state.comments,
    favorites: state.favorites
  }
}

const mapDispatchToProps = dispatch => ({
  postFavorite: (dishId) => dispatch(postFavorite(dishId)),
  postComment: (dishId, rating, author, comment) => dispatch(postComment(dishId, rating, author, comment))
});

function RenderComments(props) {

    const comments = props.comments;
            
    const renderCommentItem = ({item, index}) => {
        
        return (
            <View key={index} style={{margin: 10}}>
                <Text style={{fontSize: 14}}>{item.comment}</Text>
                <Text style={{fontSize: 12}}>{item.rating} Stars</Text>
                <Text style={{fontSize: 12}}>{'-- ' + item.author + ', ' + item.date} </Text>
            </View>
        );
    };
    
    return (
      <Animatable.View animation="fadeInUp" duration={2000} delay={1000}>        
      <Card title='Comments' >
          <FlatList 
              data={comments}
              renderItem={renderCommentItem}
              keyExtractor={item => item.id.toString()}
              />
      </Card>
      </Animatable.View>
      
    );
}



function RenderDish(props) {

    const dish = props.dish;
    handleViewRef = ref => this.view = ref;
    
    const recognizeDrag = ({ moveX, moveY, dx, dy }) => {
      if ( dx < -200 )
          return true;
      else
          return false;
  }

  const panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (e, gestureState) => {
          return true;
      },

      onPanResponderGrant: () => {this.view.rubberBand(1000).then(endState => console.log(endState.finished ? 'finished' : 'cancelled'));},

      onPanResponderEnd: (e, gestureState) => {
          console.log("pan responder end", gestureState);
          if (recognizeDrag(gestureState))
              Alert.alert(
                  'Add Favorite',
                  'Are you sure you wish to add ' + dish.name + ' to favorite?',
                  [
                  {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                  {text: 'OK', onPress: () => {props.favorite ? console.log('Already favorite') : props.onPress()}},
                  ],
                  { cancelable: false }
              );

          return true;
      }
  })

  if (dish != null) {
      return(
           <Animatable.View animation="fadeInDown" duration={2000} delay={1000}
                ref={this.handleViewRef}
                {...panResponder.panHandlers}>
              <Card
              featuredTitle={dish.name}
              image={{uri: baseUrl + dish.image}}>
                  <Text style={{margin: 10}}>
                      {dish.description}
                  </Text>
               <View style={{flexDirection: 'row',  justifyContent: 'center'}}>
                <Icon
                    raised
                    reverse
                    name={ props.favorite ? 'heart' : 'heart-o'}
                    type='font-awesome'
                    color='#f50'
                    onPress={() => props.favorite ? console.log('Already favorite') : props.onPress()}
                    />
                <Icon
                 raised
                 reverse
                 name='pencil'
                 type='font-awesome'
                 color='#512DA8'
                 onPress={() => props.openCommentModal() }
              />
               </View>
            </Card>
            </Animatable.View>
            );
        }
        else {
            return(<View></View>);
        }
}



class DishDetail extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      rating: 1,
      author: '',
      comment: ''
    }

    this.openCommentModal = this.openCommentModal.bind(this);
    this.ratingmarked = this.ratingmarked.bind(this);
  }

  markFavorite(dishId) {
    
    this.props.postFavorite(dishId);
  }

  openCommentModal() {
    this.setState({ showModal: !this.state.showModal });
  }

  ratingmarked(rating) {
    this.setState({
      'rating': rating
    });
  }

  handleComment(dishId) {
  
    this.props.postComment(dishId, this.state.rating, this.state.author, this.state.comment);
  }

  static navigationOptions = {
    title: 'Dish Details'
  }

  render() {
    const { dishId } = this.props.route.params;

    return(
      <ScrollView>
          <RenderDish dish={this.props.dishes.dishes[+dishId]}
              favorite={this.props.favorites.some(el => el === dishId)}
              onPress={() => this.markFavorite(dishId)}
              openCommentModal={this.openCommentModal}
              />
          <RenderComments comments={this.props.comments.comments.filter((comment) => comment.dishId === dishId)} />
          <Modal animationType = {"slide"} transparent = {false}
                  visible = {this.state.showModal}
                  onRequestClose = {() => this.toggleModal() }>
            <View style={styles.modal}>
              <Rating
                showRating
                Count={5}
                style={{ paddingVertical: 10 }}
                startingValue={this.state.rating}
                onFinish={this.ratingmarked}
              />
              <Input
                placeholder='Author'
                value={this.state.author}
                onChangeText={(text) => this.setState({author: text})}
                leftIcon={
                  <Icon
                    name='user-o'
                    type='font-awesome'
                    size={24}
                    color='black'
                    containerStyle={{margin: 10}}
                  />
                }
              />
              <Input
                placeholder='Comment'
                value={this.state.comment}
                onChangeText={(text) => this.setState({comment: text})}
                leftIcon={
                  <Icon
                    name='comment-o'
                    type='font-awesome'
                    size={24}
                    color='black'
                    containerStyle={{margin: 10}}
                  />
                }
              />
              <Button
                onPress={() => { this.handleComment(dishId); } }
                color='#512DA8'
                raised
                title='Submit'
              />
              <Button
                onPress={() => { this.openCommentModal();} }
                color='#a7a6a5'
                title='Cancel'
              />
            </View>
          </Modal>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  formRow: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    flexDirection: 'row',
    margin: 20
  },
  formLabel: {
    fontSize: 18,
    flex: 2
  },
  formItem: {
    flex: 1
  },
  modal: {
    justifyContent: 'center',
    margin: 20
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    backgroundColor: '#512DA8',
    textAlign: 'center',
    color: 'white',
    marginBottom: 20
  },
  modalText: {
    fontSize: 18,
    margin: 10
  }
});


export default connect(mapStateToProps, mapDispatchToProps)(DishDetail);
