import { Tabs } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";


export default function Layout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="profile"
        options={{
          title: "",
          headerShown: false,
          tabBarIcon: ({ focused }) =>
            focused ? (
              <MaterialCommunityIcons
                name="home"
                size={28}
                color="#ff0063"
                style={{
                  marginTop: 5
                }}
              />
            ) : (
              <MaterialCommunityIcons
                name="home"
                size={28}
                color="gray"
                style={{
                  marginTop: 5
                }}
              />
            ),
        }}
      />

      <Tabs.Screen
        name="chat"
        options={{
          title: "",
          headerShown: false,
          tabBarIcon: ({ focused }) =>
            focused ? (
              <MaterialCommunityIcons
                name="chat-processing-outline"
                size={28}
                color="#ff0063"
                style={{
                  marginTop: 5
                }}
              />
            ) : (
              <MaterialCommunityIcons
                name="chat-processing-outline"
                size={28}
                color="gray"
                style={{
                  marginTop: 5
                }}
              />
            ),
        }}
      />

      <Tabs.Screen
        name="bio"
        options={{
          title: "",
          headerShown: false,
          tabBarIcon: ({ focused }) =>
            focused ? (
              <MaterialCommunityIcons
                name="account"
                size={28}
                color="#ff0063"
                style={{
                  marginTop: 5
                }}
              />
            ) : (
              <MaterialCommunityIcons
                name="account"
                size={28}
                color="gray"
                style={{
                  marginTop: 5
                }}
              />
            ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "",
          headerShown: false,
          tabBarIcon: ({ focused }) =>
            focused ? (
              <Feather name="settings" size={26} color="#ff0063" style={{
                marginTop: 5,
                
              }} />
            ) : (
              <Feather name="settings" size={26} color="gray" style={{
                marginTop: 5
              }}/>
            ),
        }}
      />
      
    </Tabs>
  );
}
