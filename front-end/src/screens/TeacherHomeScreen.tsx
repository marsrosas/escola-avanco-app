import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

export default function TeacherHomeScreen() {
  const navigation = useNavigation();
  const [username, setUsername] = useState('');

  useEffect(() => {
    AsyncStorage.getItem('username').then(name => {
      if (name) setUsername(name);
    });
  }, []);

  return (
    <ScrollView 
      contentContainerStyle={{ 
        flexGrow: 1,
        backgroundColor: '#6d184e',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 40,
        paddingHorizontal: 20
      }}
    >
      <View style={{
        backgroundColor: '#f7eaea',
        borderRadius: 16,
        padding: 32,
        width: '100%',
        maxWidth: 400,
        alignItems: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        minHeight: height * 0.6
      }}>
        <Image
          source={require('../../assets/logo-avanco.png')}
          style={{ 
            width: 80, 
            height: 80, 
            marginBottom: 16 
          }}
          resizeMode="contain"
        />
        
        <Text style={{ 
          fontSize: 28, 
          fontWeight: 'bold', 
          color: '#6d184e', 
          marginBottom: 4,
          textAlign: 'center'
        }}>
          Escola <Text style={{ color: '#222' }}>Avanço</Text>
        </Text>
        
        <View style={{
          backgroundColor: '#6d184e',
          paddingHorizontal: 16,
          paddingVertical: 8,
          borderRadius: 20,
          marginBottom: 24
        }}>
          <Text style={{ 
            color: '#fff', 
            fontSize: 14, 
            fontWeight: 'bold'
          }}>
            Professor
          </Text>
        </View>

        <Text style={{ 
          fontSize: 24, 
          fontWeight: 'bold', 
          color: '#333', 
          marginBottom: 32,
          textAlign: 'center'
        }}>
          Boas-vindas{username ? `, ${username}` : ''}!
        </Text>

        <View style={{ width: '100%', gap: 16 }}>
          <TouchableOpacity
            style={{
              backgroundColor: '#6d184e',
              borderRadius: 12,
              paddingVertical: 16,
              paddingHorizontal: 24,
              width: '100%',
              alignItems: 'center',
              elevation: 2,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.22,
              shadowRadius: 2.22,
            }}
            onPress={() => navigation.navigate('Home' as never)}
          >
            <Text style={{ 
              color: '#fff', 
              fontWeight: 'bold', 
              fontSize: 16 
            }}>
              VER AULAS
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              backgroundColor: '#fff',
              borderWidth: 2,
              borderColor: '#6d184e',
              borderRadius: 12,
              paddingVertical: 16,
              paddingHorizontal: 24,
              width: '100%',
              alignItems: 'center',
              elevation: 2,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.22,
              shadowRadius: 2.22,
            }}
            onPress={() => navigation.navigate('CreatePost' as never)}
          >
            <Text style={{ 
              color: '#6d184e', 
              fontWeight: 'bold', 
              fontSize: 16 
            }}>
              CRIAR NOVA AULA
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}