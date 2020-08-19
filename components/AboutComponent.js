import React,{Component} from 'react';
import { FlatList, View, ScrollView,Text } from 'react-native';
import { ListItem,Card} from 'react-native-elements';
import { LEADERS } from '../shared/leaders';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import { Loading } from './LoadingComponent';

const mapStateToProps = state => {
    return {
      leaders: state.leaders
    }
  }

const History=() => {
    return (
        <Card
        title="Our History">
        <View>
          <Text>Started in 2010, Ristorante con Fusion quickly established itself as a culinary icon par excellence in Hong Kong. With its unique brand of world fusion cuisine that can be found nowhere else, it enjoys patronage from the A-list clientele in Hong Kong.  Featuring four of the best three-star Michelin chefs in the world, you never know what will arrive on your plate the next time you visit us.</Text>
          <Text>The restaurant traces its humble beginnings to The Frying Pan, a successful chain started by our CEO, Mr. Peter Pan, that featured for the first time the world's best cuisines in a pan.</Text>
        </View>
      </Card>
    );
  }



  const Leaders = () => {
  
    const renderLeaders = ({item, index}) => {
      return(
        <ListItem
          key={index}
          title={item.name}
          subtitle={item.description}
          hideChevron={true}
          leftAvatar={{source: {uri: baseUrl + item.image}}}
        />
      )
    };
    if (this.props.leaders.isLoading) {
      return(
          <ScrollView>
              <History />
              <Card
                  title='Corporate Leadership'>
                  <Loading />
              </Card>
          </ScrollView>
      );
  }
  else if (this.props.leaders.errMess) {
      return(
          <ScrollView>
              <History />
              <Card
                  title='Corporate Leadership'>
                  <Text>{this.props.leaders.errMess}</Text>
              </Card>
          </ScrollView>
      );
  }
  else {
      return(
          <ScrollView>
              <History />
              <Card
                  title='Corporate Leadership'>
              <FlatList 
                  data={this.props.leaders.leaders}
                  renderItem={renderLeader}
                  keyExtractor={item => item.id.toString()}
                  />
              </Card>
          </ScrollView>
      );
  }
}
 
class About extends Component {

    constructor(props) {
        super(props);
        this.state = {
            leaders: LEADERS
        };
    }

   static navigationOptions = {
        title: 'About Us'
    };

    
        render() {
            return(
                <ScrollView>
                  <History/>                   
                  <Leaders />               
              </ScrollView>
            );
          }
        
}
export default connect(mapStateToProps)(About);