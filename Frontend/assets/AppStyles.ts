import { StyleSheet } from "react-native";

export const theme = {
  colors: {
    primary: "#FF2D8B",
    background: "#fff",
    border: "#F3F4F6",
    text: "#222",
    secondaryText: "#4B5563",
    accent: "#6366F1",
    star: "#FFB800",
    modalOverlay: "rgba(0,0,0,0.2)",
    disabled: "#AAA",
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 8,
    md: 14,
    lg: 20,
    xl: 24,
  },
  font: {
    regular: "SpaceMono-Regular",
  },
};

export const floatingButtonStyles = StyleSheet.create({
  button: {
    position: "absolute",
    bottom: 30,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 10,
  },
});

export const bookmarkModalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: theme.colors.modalOverlay,
    justifyContent: "flex-end",
  },
  modal: {
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: theme.borderRadius.xl,
    borderTopRightRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
    minHeight: 400,
    maxHeight: "80%",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: -2 },
    elevation: 8,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: theme.spacing.md,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.colors.text,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  info: {
    marginLeft: theme.spacing.md,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
  },
  skill: {
    color: theme.colors.secondaryText,
    fontSize: 14,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: theme.spacing.lg,
  },
  actionBtn: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    paddingVertical: 12,
    borderRadius: theme.borderRadius.lg,
    alignItems: "center",
    marginHorizontal: 4,
  },
  saveBtn: {
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  actionText: {
    color: theme.colors.background,
    fontWeight: "bold",
    fontSize: 15,
  },
  disabledBtn: {
    opacity: 0.5,
  },
});

export const freelancerCardStyles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  name: {
    fontSize: 17,
    fontWeight: "bold",
    color: theme.colors.text,
    flex: 1,
  },
  skill: {
    color: theme.colors.secondaryText,
    fontSize: 15,
    marginTop: 2,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  rating: {
    marginLeft: 4,
    color: theme.colors.text,
    fontWeight: "600",
    fontSize: 15,
  },
});

export const filterBarStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: theme.spacing.md,
  },
  button: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.border,
    marginHorizontal: 6,
  },
  selectedButton: {
    backgroundColor: theme.colors.primary,
  },
  text: {
    color: theme.colors.text,
    fontWeight: "600",
    fontSize: 15,
  },
  selectedText: {
    color: theme.colors.background,
  },
}); 