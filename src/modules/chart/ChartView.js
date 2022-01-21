import React from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  ScrollView,
  BackHandler
} from 'react-native';
import { BarChart } from "react-native-chart-kit";
import Carousel from 'react-native-snap-carousel';
import Menu, { MenuItem } from 'react-native-material-menu';
import axios from 'axios';

import { api, authKey } from '../../auth';
import Footer from '../../components/TabBar';

const width = Dimensions.get('window').width;

export default class ChartView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isChart: false,
      showType: 'week',
      tableData: {
        week: [],
        month: [],
        year: [
        ]
      },
      total: {
        week: {
          kwh: 0,
          euro: 0,
        },
        month: {
          kwh: 0,
          euro: 0,
        },
        year: {
          kwh: 0,
          euro: 0,
        },
      },
      selectedId: null,
      activeIndex: 0,
      graphData: {
        week: [{
          labels: ["S", "M", "T", "W", "T", "F", 'S'],
          datasets: [
            {
              data: [],
            }
          ],
        }],
        month: [{
          labels: ["1", "", "", "", "5", "", '', '', '', '10', '', '', '', '', '15', '', '', '', '', '20', '', '', '', '', '25', '', '', '', '', '30'],
          datasets: [
            {
              data: [],
            }
          ],
        },],
        year: [{
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 'Jul', 'Agu', 'Sep', 'Oct', 'Nov', 'Dec'],
          datasets: [
            {
              data: [],
            }
          ],
        }],
      },
      graphTitles: [
        ['€', 'Money Spent'],
        ['kW', 'CONSUMPTION'],
      ],
      _menu: null,
    };
    this.BackHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick.bind(this));
    this.renderItem = this.renderItem.bind(this);
    this.getChartData = this.getChartData.bind(this);
    this.formatDate = this.formatDate.bind(this);
    this.getAllData = this.getAllData.bind(this);
    this.getLabels = this.getLabels.bind(this);
    this.setMenuRef = this.setMenuRef.bind(this);
    this.showMenu = this.showMenu.bind(this);
    this.hideMenu = this.hideMenu.bind(this);
  }
  
  componentDidMount() {
    this.getAllData();
  }
  getLabels = (type, length) => {
    if (type === 'week') return ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
    if (type === 'year') return ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 'Jul', 'Agu', 'Sep', 'Oct', 'Nov', 'Dec'];
    let arr = [];
    for (let i = 1; i <= length; i++) {
      if (i > 1 && i % 5) arr.push('');
      else arr.push(i.toString());
    }
    return arr;
  }
  getAllData = async () => {
    await this.getChartData('week');
    await this.getChartData('month');
    await this.getChartData('year');
  }
  handleBackButtonClick() {
    this.props.setActiveTab('Chart')
  }
  componentWillUnmount() {
    this.BackHandler.remove();
  }

  formatDate = (date) => {
    var d = new Date(date),
    
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }
  async getChartData(type) {
    const params = new URLSearchParams();
    const chargerId = this.props.charger?.ilucharge_id;
    if (!chargerId) return;

    params.append('ilu_id', chargerId);

    if (type === 'week') {
      var curr = new Date; // get current date
      var first = curr.getDate() - curr.getDay() - 7; // First day is the day of the month - the day of the week
      var firstday = new Date(curr.setDate(first));
      params.append('action', 'sessions_week');
      params.append('date', this.formatDate(firstday));
    }
    else if (type === 'month') {
      const currentDate = new Date();
      currentDate.setMonth(currentDate.getMonth() - 1);
      params.append('action', 'sessions_month');
      params.append('date', this.formatDate(currentDate));
    }
    else {
      const currentYear = (new Date()).getFullYear();
      params.append('action', 'sessions_year');
      params.append('year', currentYear-1);
    }

    await axios.post(api, params, {
      headers: {
        'AUTH_key': authKey,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then((res) => {
      const response = res.data;
      let newArr = [], graphInfoPower = [], graphInfoCost = [];

      for (const [key, value] of Object.entries(response.data)) {
        newArr.push({
          id: key,
          date: key,
          kwh: value?.kwh || 0,
          euro: value?.euro || 0,
        });
        graphInfoPower.push(value?.kwh || 0);
        graphInfoCost.push(value?.euro || 0);
      }

      let { tableData, graphData, total } = this.state;
      tableData[type] = [...newArr];
      const labels = this.getLabels(type, newArr.length);
      graphData[type] = [];
      graphData[type].push({
        labels: [...labels],
        datasets: [
          {
            data: [...graphInfoCost],
          }
        ],
      });
      graphData[type].push({
        labels: [...labels],
        datasets: [
          {
            data: [...graphInfoPower],
          }
        ],
      })
      total[type] = {...response.total};

      this.setState({
        tableData: {...tableData},
        graphData: {...graphData},
        total: {...total}
      })
    }).catch(err => console.log('err ==> ', err));
  }

  renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        key={item.id}
        onPress={() => this.setState({ selectedId: item.id })}
        style={styles.itemContainer}
      >
        <Text style={styles.dateText}>{item.date}</Text>
        <View style={styles.itemContent}>
          
          <View>
            <Text style={styles.itemTitle}>ENERGY CHARGED</Text>
            <Text style={styles.itemContentTitle}>{item.kwh}kWh</Text>
          </View>
          <View>
            <Text style={styles.itemTitle}>COST (EURO/KWH)</Text>
            <Text style={styles.itemContentTitle}>€{item.euro}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  _renderBarChart = ({ item, index }) => {
    const { showType, graphTitles } = this.state;
    
    const chartConfig = {
      data: [],
      decimalPlaces: 0,
      backgroundColor: 'white',
      backgroundGradientFrom: "white",
      backgroundGradientTo: "white",
      barRadius: 5,
      color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
      labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
      fillShadowGradient: 'blue',
      fillShadowGradientOpacity: 1,
      // useShadowColorFromDataset: true,
    };

    return (
      <>
        <BarChart
          style={styles.graphStyle}
          data={item}
          width={width - 60}
          height={260}
          showBarTops={false}
          withInnerLines={false}
          chartConfig={{
            ...chartConfig,
            fillShadowGradient: !index ? '#0066FF' : index === 1 ? '#00e676' : '#FA7F58',
            barPercentage: (showType === 'week' ? 0.3 : showType === 'month' ? 0.05 : 0.2),
          }}
          fromZero={true}
          verticalLabelRotation={showType === 'year' ? 30 : 0}
        />
        
        <View style={styles.graphTitle}>
          <View style={{flexDirection: 'row'}}>
            <View style={{width: 50}}>
              <Text style={{textAlign: 'center'}}>{graphTitles[index][0]}</Text>
            </View>
            <Text>{graphTitles[index][1]}</Text>
          </View>
        </View>
      </>
    )
  }

  setMenuRef = ref => {
    this._menu = ref;
  };
  hideMenu = (value) => {
    this.setState({showType: value})
    this._menu.hide();
  };
  showMenu = () => {
    this._menu.show();
  };

  render() {
    const { isChart, showType, tableData, graphData, total, selectedId } = this.state;

    return (
      <View style={styles.container}>
        <View style={styles.wrapper}>
          <View style={styles.settingBar}>
            <View style={styles.showTypeStyle}>
              <Menu
                ref={this.setMenuRef}
                button={
                  <Text onPress={this.showMenu}>
                    {showType.charAt(0).toUpperCase() + showType.slice(1) + 'ly'}
                  </Text>
                }
              >
                <MenuItem style={styles.MenuItem} onPress={() => this.hideMenu('week')}>Weekly</MenuItem>
                <MenuItem style={styles.MenuItem} onPress={() => this.hideMenu('month')}>Monthly</MenuItem>
                <MenuItem style={styles.MenuItem} onPress={() => this.hideMenu('year')}>Yearly</MenuItem>
              </Menu>
            </View>
            <TouchableOpacity style={styles.showChart} onPress={() => this.setState({ isChart: !isChart })}>
              <View style={styles.chartIconContainer}>
                <View style={styles.chartIconContent}>
                  <Image
                    source={isChart ? require('../../../assets/images/icons/chart.png') : require('../../../assets/images/icons/list.png')}
                    style={styles.chartIcon}
                    resizeMode="stretch"
                  />
                </View>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            {isChart ?
              <FlatList
                data={tableData[showType]}
                renderItem={this.renderItem}
                keyExtractor={(item) => item.id.toString()}
                extraData={selectedId}
              />
              :
              <SafeAreaView style={{ flex: 1 }}>
                <ScrollView>
                  <View style={{position: 'relative'}}>
                    <Carousel
                      layout={"default"}
                      data={graphData[showType]}
                      sliderWidth={width - 60}
                      itemWidth={width - 60}
                      renderItem={this._renderBarChart}
                      onSnapToItem={(index) => this.setState({activeIndex: index})} 
                    />

                    <View style={styles.barchartContainer}>
                      <View>
                        <View style={styles.iconContainer}>
                          <Image
                            source={require('../../../assets/images/icons/power.png')}
                            style={styles.icon}
                            resizeMode="stretch"
                          />
                          <Text style={styles.itemSmallText}>Total Charged</Text>
                        </View>
                        <Text style={styles.itemBigText}>{total[showType].kwh}kWh</Text>
                      </View>
                      <View style={styles.directionIconContainer}>
                        <Image
                          source={require('../../../assets/images/icons/up.png')}
                          style={[styles.directionIcon, { tintColor: '#61FFB0' }]}
                          resizeMode="stretch"
                        />
                      </View>
                    </View>

                    <View style={styles.barchartContainer}>
                      <View>
                        <View style={styles.iconContainer}>
                          <Image
                            source={require('../../../assets/images/icons/time.png')}
                            style={styles.icon}
                            resizeMode="stretch"
                          />
                          <Text style={styles.itemSmallText}>Total Money Spent</Text>
                        </View>
                        <Text style={styles.itemBigText}>€{total[showType].euro}</Text>
                      </View>
                      <View style={styles.directionIconContainer}>
                        <Image
                          source={require('../../../assets/images/icons/up.png')}
                          style={[styles.directionIcon, { tintColor: '#61FFB0' }]}
                          resizeMode="stretch"
                        />
                      </View>
                    </View>
                  </View>
                </ScrollView>
              </SafeAreaView>
            }
          </View>
        </View>
        <Footer {...this.props}/>
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  wrapper: {
    flex: 1,
    paddingLeft: 30,
    paddingRight: 30,
  },
  settingBar: {
    height: 40,
    position: 'relative',
    marginTop: 5,
  },
  showChart: {
    height: 40,
    width: 40,
    position: 'absolute',
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: 'white'
  },
  chartIconContainer: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chartIconContent: {
    width: 17,
    height: 17,
  },
  chartIcon: {
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
    marginTop: 15,
  },
  itemContainer: {
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    backgroundColor: 'white',
  },
  dateText: {
    fontSize: 20,
    paddingBottom: 5,
    fontWeight: 'bold'
  },
  itemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemContentTitle: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  itemTitle: {
    fontSize: 10,
    fontWeight: 'bold'
  },
  barchartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    textAlignVertical: 'center',
  },
  icon: {
    width: 12,
    height: 12,
    marginTop: 1,
    marginRight: 5,
  },
  itemSmallText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  itemBigText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  directionIconContainer: {
    justifyContent: 'center',
  },
  directionIcon: {
    width: 20,
    height: 30,
  },
  showTypeStyle: {
    backgroundColor: 'white',
    width: 70,
    height: 40,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  MenuItem: {
    paddingVertical: 0,
    height: 35,
  },
  graphStyle: {
    borderRadius: 15,
    paddingTop: 25,
    backgroundColor: 'white',
    position: 'relative',
  },
  graphTitle: {
    position: 'absolute',
    top: 10,
    left: 20,
  },
});