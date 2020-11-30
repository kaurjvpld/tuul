/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {Col, Row, Grid} from 'react-native-easy-grid';
import axios from 'axios';
import auth from '@react-native-firebase/auth';

const VehicleDetailsBar: () => React$Node = ({vehicle}) => {
  const [processingCommand, setProcessingCommand] = useState(false);

  function startScooter() {
    return sendCommand('START');
  }
  function stopScooter() {
    return sendCommand('STOP');
  }
  function openBatteryDoor() {
    return sendCommand('OPEN_BAT_DOOR');
  }
  async function sendCommand(command) {
    setProcessingCommand(true);
    let authToken = await auth().currentUser.getIdToken();
    let vehicleId = vehicle.id;
    try {
      await axios.post(
        `https://us-central1-coscooter-eu.cloudfunctions.net/send-commands?apiKey=${authToken}`,
        {command, vehicleId},
      );
    } catch (error) {
      console.log(
        'Something went wrong when sending the command to the scooter..',
      );
      console.log(error.message);
      setProcessingCommand(false);
    }
    setProcessingCommand(false);
  }

  return (
    <Grid>
      <Row size={75} />
      <Row
        size={9}
        style={{backgroundColor: 'rgba(255, 255, 255, 0.9)', paddingTop: 20}}>
        <Col
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            borderRightColor: '#ddddde',
            borderRightWidth: 2,
            borderRightStyle: 'double',
          }}>
          <Text>Battery</Text>
          <Text style={{fontWeight: 'bold', marginTop: 2, marginBottom: 2}}>
            {vehicle.soc}%
          </Text>
          <Text>
            <View>
              <Text>
                L
                {typeof vehicle.batTwoSoc === 'number'
                  ? vehicle.batTwoSoc
                  : 'N/A'}
                %
              </Text>
            </View>
            <View>
              <Text style={{marginLeft: 10}}>
                R
                {typeof vehicle.batOneSoc === 'number'
                  ? vehicle.batOneSoc
                  : 'N/A'}
                %
              </Text>
            </View>
          </Text>
        </Col>
        <Col style={{justifyContent: 'center', alignItems: 'center'}}>
          <Text>Odometer</Text>
          <Text style={{fontWeight: 'bold', marginTop: 2}}>
            {Math.round(vehicle.odometer * 10) / 10}km
          </Text>
        </Col>
      </Row>
      <Row
        size={10}
        style={{backgroundColor: 'rgba(255, 255, 255, 0.9)', paddingTop: 10}}>
        <Col
          style={{
            justifyContent: 'center',
            alignItems: 'stretch',
            paddingLeft: 30,
            paddingRight: 30,
          }}>
          {vehicle.poweredOn && (
            <TouchableOpacity
              onPress={() => stopScooter()}
              disabled={processingCommand}>
              <Text
                style={[
                  styles.button,
                  processingCommand
                    ? styles.primaryButtonDisabled
                    : styles.primaryButtonEnabled,
                ]}>
                STOP
              </Text>
            </TouchableOpacity>
          )}
          {!vehicle.poweredOn && (
            <TouchableOpacity
              onPress={() => startScooter()}
              disabled={processingCommand}>
              <Text style={styles.button}>START</Text>
            </TouchableOpacity>
          )}
        </Col>
        <Col
          style={{
            justifyContent: 'center',
            alignItems: 'stretch',
            paddingLeft: 30,
            paddingRight: 30,
          }}>
          <TouchableOpacity
            onPress={() => openBatteryDoor()}
            disabled={processingCommand}>
            <Text
              style={[
                styles.button,
                processingCommand
                  ? styles.successButtonDisabled
                  : styles.successButtonEnabled,
              ]}>
              Open Bat
            </Text>
          </TouchableOpacity>
        </Col>
      </Row>
    </Grid>
  );
};

export default VehicleDetailsBar;

const styles = StyleSheet.create({
  primaryButtonEnabled: {
    backgroundColor: 'rgba(0, 123, 255, 1)',
  },
  primaryButtonDisabled: {
    backgroundColor: 'rgba(0, 123, 255, 0.6)',
  },
  successButtonEnabled: {
    backgroundColor: 'rgba(40, 167, 69, 1)',
  },
  successButtonDisabled: {
    backgroundColor: 'rgba(40, 167, 69, 0.6)',
  },
  button: {
    color: 'white',
    paddingTop: 8,
    paddingRight: 10,
    paddingBottom: 8,
    paddingLeft: 10,
    borderRadius: 6,
    textAlign: 'center',
  },
});
