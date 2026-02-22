import { Redirect } from 'expo-router';

// App opens directly without authentication
export default function Index() {
  return <Redirect href="/(tabs)/home" />;
}
