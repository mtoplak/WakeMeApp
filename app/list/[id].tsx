import { View, Text } from 'react-native';
import { Stack, useSearchParams } from 'expo-router';

const DetailsPage = () => {
  const { id } = useSearchParams();

  return (
    <View>
      <Stack.Screen options={{ headerTitle: `News #${id}` }} />

      <Text>My Details for: {id}</Text>
    </View>
  );
};

export default DetailsPage;
