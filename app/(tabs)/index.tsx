import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, ActivityIndicator, Image} from 'react-native';
import axios from 'axios';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationIndependentTree } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { createDrawerNavigator } from '@react-navigation/drawer';

const Drawer = createDrawerNavigator();

// Komponen Tombol Kustom
function CustomButton({ title, onPress }: { title: string; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
}

// Halaman Stack 1: NIM dan Nama
function HomeScreen({ navigation }: { navigation: any }) {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Hello!</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Nama:</Text>
        <Text style={styles.text}>Tsalitsa Hasna Azizah</Text>
        <Text style={styles.label}>NIM:</Text>
        <Text style={styles.text}>222505071</Text>
        </View>
    </View>
  );
}

// Halaman Stack 2: Tentang
function AboutScreen({ navigation }: { navigation: any }) {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>About Me</Text>
      <Image
      source={require('../assets/foto.jpg')}
      style={styles.profileImage}
      />
      <Text style={styles.text}>Saya adalah mahasiswa jurusan Sistem Informasi di Universitas Ma'soem. Saat ini, saya sedang mendalami berbagai aspek teknologi informasi, seperti pengembangan perangkat lunak, manajemen data, dan analisis sistem.</Text>
    </View>
  );
}

// Halaman Stack 3: Hobi
function HobbiesScreen({ navigation }: { navigation: any }) {
  const hobbies = [
    { id: 1, name: "Watching Movies", icon: "movie" },
    { id: 2, name: "Swimming", icon: "pool" },
    { id: 3, name: "Cooking", icon: "soup-kitchen" },
  ];
  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Hobbies</Text>
      <View style={styles.card}>
      <FlatList
        data={hobbies}
        renderItem={({ item }) => (
          <View style={styles.hobbyItem}>
            <Icon name={item.icon} size={20} color="#4b6043" style={styles.hobbyIcon} />
            <Text style={styles.text}>{item.name}</Text>
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
        />
        </View>
    </View>
  );
}

interface Mahasiswa {
  id: string;
  nim: string;
  nama: string;
  kelas: string;
  points: string;
}

function Mhs({ navigation}: { navigation: any }) {
  const [mahasiswa, setMahasiswa] = useState<Mahasiswa[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchMahasiswa = async () => {
    console.log("Fetching data from API...");
    setLoading(true);
    try {
      const response = await axios.get('https://api.allorigins.win/raw?url=https://mmc-clinic.com/dipa/api/mhs.php');
      console.log("Data diterima:", response.data);
      const mahasiswaData: Mahasiswa[] = response.data?.data || [];
      
      const shuffled = mahasiswaData.sort(() => 0.5 - Math.random());
      setMahasiswa(shuffled.slice(0, 10));
    } catch (error: any) {
      console.error("Error fetching data:", error.response ? error.response.data : error.message || error);
      alert("Gagal memuat data mahasiswa. Coba lagi!");
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchMahasiswa();
  }, []);

  const renderItem = ({ item }: { item: Mahasiswa }) => (
    <View style={styles.container}>
      <View style={styles.card}>
      <Text style={styles.itemText}>ID: {item.id}</Text>
              <Text style={styles.itemText}>NIM: {item.nim}</Text>
              <Text style={styles.itemText}>Nama: {item.nama}</Text>
              <Text style={styles.itemText}>Kelas: {item.kelas}</Text>
              <Text style={styles.itemText}>Points: {item.points}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Berikut adalah 10 orang kawan saya di Prodi SI secara random:</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#556B2F" />
      ) : (
        <FlatList
        data={mahasiswa}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        />
      )}
      <TouchableOpacity
        style={styles.refreshButton} onPress={fetchMahasiswa}
      >
        <Text style={styles.refreshButtonText}>Refresh List</Text>
      </TouchableOpacity>
    </View>
  );
};

const Stack = createStackNavigator();

function StackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#A8B5A1', // Hijau Sage untuk header
        },
        headerTintColor: '#FFFFFF', // Putih untuk teks header
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="About" component={AboutScreen} />
      <Stack.Screen name="Hobbies" component={HobbiesScreen} />
    </Stack.Navigator>
  );
}

// Navigasi Tab
const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationIndependentTree>
    <NavigationContainer>
    <Drawer.Navigator
        initialRouteName="Home"
        screenOptions={{
          drawerStyle: {
            backgroundColor: '#A8B5A1', // Hijau sage untuk drawer
          },
          drawerActiveTintColor: '#FFFFFF', // Warna teks aktif
          drawerInactiveTintColor: '#4F4F4F', // Warna teks non-aktif
          drawerActiveBackgroundColor: '#6B8E76', // Hijau sage lebih gelap
          headerStyle: {
            backgroundColor: '#A8B5A1', // Hijau sage untuk header
          },
          headerTintColor: '#FFFFFF', // Warna putih untuk teks header
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Drawer.Screen name="Home" component={HomeScreen} />
        <Drawer.Screen name="About" component={AboutScreen} />
        <Drawer.Screen name="Hobbies" component={HobbiesScreen} />
        <Drawer.Screen name="Friends" component={Mhs} />
      </Drawer.Navigator>
    </NavigationContainer>
        </NavigationIndependentTree>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F4',
    padding: 7,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#808D7C',
    marginBottom: 20,
  },
  card: {
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#E4E0E1',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D0D0CE',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, // Efek bayangan di Android
  },
  itemText: {
    fontSize: 16,
    color: '#697565',
  },
  refreshButton: {
    marginTop: 20,
    backgroundColor: '#808D7C',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  refreshButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    color: '#A8B5A1', // Warna sage
    marginTop: 10,
    textAlign: 'center',
  },
  text: {
    fontSize: 16,
    color: '#333333', // Warna abu gelap
    marginBottom: 5,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#A8B5A1', // Hijau Sage untuk tombol
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    margin: 10,
  },
  buttonText: {
    color: '#FFFFFF', // Putih untuk teks tombol
    fontWeight: 'bold',
    textAlign: 'center',
  },
  hobbyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  hobbyIcon: {
    marginRight: 10,
    alignItems: 'center',
  },
  profileImage: {
    width: 100, // Lebar gambar
    height: 100, // Tinggi gambar
    borderRadius: 75, // Membuat gambar berbentuk lingkaran
    alignSelf: 'center', // Posisikan di tengah
    marginBottom: 20, // Spasi bawah gambar
  },
}
);

