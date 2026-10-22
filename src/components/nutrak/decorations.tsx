import { StyleSheet, View } from "react-native";

/** Decorative leaf sprigs pinned to the bottom corners of a screen. */
export function BottomLeaves() {
  return (
    <View pointerEvents="none" style={styles.container}>
      <View style={styles.side}>
        <View style={[styles.leaf, styles.l1]} />
        <View style={[styles.leaf, styles.l2]} />
        <View style={[styles.leaf, styles.l3]} />
      </View>
      <View style={styles.hill} />
      <View style={[styles.side, styles.sideRight]}>
        <View style={[styles.leaf, styles.r1]} />
        <View style={[styles.leaf, styles.r2]} />
        <View style={[styles.leaf, styles.r3]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 56,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    overflow: "hidden",
  },
  hill: {
    position: "absolute",
    left: "15%",
    right: "15%",
    bottom: -40,
    height: 60,
    borderRadius: 200,
    backgroundColor: "#E6F3DC",
    opacity: 0.8,
  },
  side: {
    width: 60,
    height: "100%",
    zIndex: 1,
  },
  sideRight: {
    alignItems: "flex-end",
  },
  leaf: {
    position: "absolute",
    width: 14,
    height: 30,
    borderTopLeftRadius: 2,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 2,
  },
  l1: { left: 4, bottom: -4, backgroundColor: "#8CD46D", transform: [{ rotate: "-35deg" }] },
  l2: { left: 20, bottom: 6, backgroundColor: "#55B95A", transform: [{ rotate: "20deg" }] },
  l3: { left: 6, bottom: 22, backgroundColor: "#A7DF8D", transform: [{ rotate: "-20deg" }, { scale: 0.8 }] },
  r1: { right: 4, bottom: -4, backgroundColor: "#8CD46D", transform: [{ rotate: "35deg" }] },
  r2: { right: 20, bottom: 6, backgroundColor: "#55B95A", transform: [{ rotate: "-20deg" }] },
  r3: { right: 6, bottom: 22, backgroundColor: "#A7DF8D", transform: [{ rotate: "20deg" }, { scale: 0.8 }] },
});
