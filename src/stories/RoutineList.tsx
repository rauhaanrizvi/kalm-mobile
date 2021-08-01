import React from "react";
import {
  Box,
  Button,
  View,
  Heading,
  StatusBar,
  Pressable,
  Icon,
} from "native-base";
import {
  SectionList,
  StyleSheet,
  TouchableOpacity,
  Text,
} from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AddRoutines from "./AddRoutines";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLOR_ACCENT, COLOR_HIGHLIGHT, TAB_HEIGHT } from "./utils";
import { Settings } from "./Settings";
import { SwipeItem, SwipeUnderlay } from "./SwipeItem";
import { UnderlayParams } from "react-native-swipeable-item";
import Animated from "react-native-reanimated";

const Tab = createBottomTabNavigator();

const renderUnderlayLeft = ({ item, percentOpen }: UnderlayParams<any>) => (
  <Animated.View style={[styles.underlayLeft, { opacity: percentOpen }]}>
    <SwipeUnderlay
      bg="secondary.600"
      pressFn={() => console.log(item)}
      iconName="delete"
    />
    <SwipeUnderlay
      bg="primary.600"
      pressFn={() => console.log(item)}
      iconName="edit"
    />
  </Animated.View>
);

const Routines = ({ data, handlePress }) => (
  <SafeAreaView>
    <Box p={4}>
      <Heading>All Routines</Heading>
      <SectionList
        sections={data}
        contentContainerStyle={{
          paddingBottom: 110,
          backgroundColor: "#fff",
        }}
        keyExtractor={(item, index) => item + index}
        renderItem={(props) => (
          <SwipeItem
            {...props}
            drag={false}
            renderUnderlayLeft={renderUnderlayLeft}
            handlePress={handlePress}
          />
        )}
        renderSectionHeader={({ section: { title } }) => (
          <Box
            px={5}
            py={2}
            bg="primary.200"
            _text={{
              fontWeight: "bold",
            }}
          >
            {title}
          </Box>
        )}
      />
    </Box>
  </SafeAreaView>
);

function TabBar({ state, descriptors, navigation }) {
  const focusedOptions = descriptors[state.routes[state.index].key].options;

  if (focusedOptions.tabBarVisible === false) {
    return null;
  }

  return (
    <BlurView intensity={100} style={[styles.blurTab]}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          height: 50,
        }}
      >
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };
          const iconName = options.tabBarTestID;
          const isMiddle = index === 1;
          const tabColor = isMiddle ? "white" : "#222";
          const tabStyle = isMiddle
            ? {
                alignItems: "center",
                justifyContent: "center",
                width: TAB_HEIGHT,
                height: TAB_HEIGHT,
                transform: [{ translateY: -20 }],
                backgroundColor: COLOR_ACCENT,
                borderRadius: 50,
              }
            : { alignItems: "center", justifyContent: "center", width: 60 };

          return (
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              key={route.key}
              style={tabStyle}
            >
              <Ionicons
                name={iconName}
                color={isFocused ? COLOR_HIGHLIGHT : tabColor}
                size={isMiddle ? 48 : 24}
              />
              {Boolean(!isMiddle) && (
                <Text style={{ color: tabColor }}>{label}</Text>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </BlurView>
  );
}

export default ({
  animated,
  handleAddRoutine,
  settingsData,
  ...props
}: {
  animated: any;
  data: object;
  handleAddRoutine: (e: any) => void;
  settingsData: object[];
  handlePress: () => void;
}) => {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <Tab.Navigator
        tabBar={(props) => {
          return <TabBar {...props} />;
        }}
      >
        <Tab.Screen
          options={{
            tabBarLabel: "Home",
            tabBarAccessibilityLabel: "Home Screen",
            tabBarTestID: "home",
          }}
          name="Home"
        >
          {() => <Routines {...props} />}
        </Tab.Screen>
        <Tab.Screen
          options={{
            tabBarLabel: "Add",
            tabBarAccessibilityLabel: "Add Screen",
            tabBarTestID: "add",
          }}
          name="Add Activity"
        >
          {(props) => (
            <AddRoutines
              handleSubmit={(e) => {
                handleAddRoutine(e);
                props.navigation.jumpTo("Home");
              }}
              animated={animated}
            />
          )}
        </Tab.Screen>
        <Tab.Screen
          options={{
            tabBarLabel: "Settings",
            tabBarAccessibilityLabel: "Settings Screen",
            tabBarTestID: "settings",
          }}
          name="Settings"
        >
          {() => <Settings data={settingsData} />}
        </Tab.Screen>
      </Tab.Navigator>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  blurredImage: {
    width: 192,
    height: 192,
  },
  blurTab: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
  },
  underlayLeft: {
    flex: 1,
    backgroundColor: "gray",
    justifyContent: "flex-end",
    alignItems: "center",
    flexDirection: "row",
  },
});
