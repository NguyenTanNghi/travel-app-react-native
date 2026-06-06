import React, { useEffect, useMemo, useState } from "react";
import {
  Modal,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAppTheme } from "@/src/hooks/useAppTheme";
import { useLocalization } from "@/src/hooks/useLocalization";
import { radius, spacing } from "@/src/theme";
import {
  getLocalDateInputValue,
  getTomorrowDateInputValue,
} from "@/src/utils/date";

type DatePickerInputProps = {
  containerStyle?: StyleProp<ViewStyle>;
  label?: string;
  minimumDate?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  value: string;
};

type CalendarCell = {
  dateValue?: string;
  day?: number;
  isDisabled?: boolean;
  isSelected?: boolean;
  key: string;
};

function getDateFromInputValue(value: string) {
  const [year, month, day] = value.split("-").map(Number);

  if (!year || !month || !day) {
    return null;
  }

  const parsedDate = new Date(year, month - 1, day);

  return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
}

function getMonthKey(date: Date) {
  return date.getFullYear() * 12 + date.getMonth();
}

function getMonthTitle(date: Date, language: "en" | "vi") {
  return new Intl.DateTimeFormat(language === "vi" ? "vi-VN" : "en-US", {
    month: "long",
    year: "numeric",
  }).format(date);
}

function getWeekLabels(language: "en" | "vi") {
  return language === "vi"
    ? ["CN", "T2", "T3", "T4", "T5", "T6", "T7"]
    : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
}

export function DatePickerInput({
  containerStyle,
  label,
  minimumDate,
  onChange,
  placeholder = "YYYY-MM-DD",
  value,
}: DatePickerInputProps) {
  const { theme } = useAppTheme();
  const { language, t } = useLocalization();
  const minimumDateValue = minimumDate ?? getTomorrowDateInputValue();
  const minimumDateObject = useMemo(
    () => getDateFromInputValue(minimumDateValue) ?? new Date(),
    [minimumDateValue],
  );
  const selectedDateObject = useMemo(
    () => (value ? getDateFromInputValue(value) : null),
    [value],
  );
  const [isPickerVisible, setPickerVisible] = useState(false);
  const [visibleMonth, setVisibleMonth] = useState(
    selectedDateObject ?? minimumDateObject,
  );
  const weekLabels = getWeekLabels(language);
  const isPreviousMonthDisabled =
    getMonthKey(visibleMonth) <= getMonthKey(minimumDateObject);

  useEffect(() => {
    if (isPickerVisible) {
      setVisibleMonth(selectedDateObject ?? minimumDateObject);
    }
  }, [isPickerVisible, minimumDateObject, selectedDateObject]);

  const cells = useMemo<CalendarCell[]>(() => {
    const year = visibleMonth.getFullYear();
    const month = visibleMonth.getMonth();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const blankCells = Array.from({ length: firstDayOfMonth }, (_, index) => ({
      key: `blank-${year}-${month}-${index}`,
    }));
    const dayCells = Array.from({ length: daysInMonth }, (_, index) => {
      const day = index + 1;
      const dateValue = getLocalDateInputValue(new Date(year, month, day));

      return {
        dateValue,
        day,
        isDisabled: dateValue < minimumDateValue,
        isSelected: dateValue === value,
        key: dateValue,
      };
    });

    return [...blankCells, ...dayCells];
  }, [minimumDateValue, value, visibleMonth]);

  const goToMonth = (offset: number) => {
    setVisibleMonth(
      (current) => new Date(current.getFullYear(), current.getMonth() + offset, 1),
    );
  };

  const handleSelectDate = (dateValue?: string, isDisabled?: boolean) => {
    if (!dateValue || isDisabled) {
      return;
    }

    onChange(dateValue);
    setPickerVisible(false);
  };

  return (
    <View style={containerStyle}>
      {label ? (
        <Text style={[styles.label, { color: theme.colors.text }]}>{label}</Text>
      ) : null}
      <Pressable
        accessibilityRole="button"
        onPress={() => setPickerVisible(true)}
        style={[styles.field, { backgroundColor: theme.colors.input }]}
      >
        <Ionicons
          name="calendar-outline"
          size={18}
          color={theme.colors.icon}
          style={styles.leftIcon}
        />
        <Text
          numberOfLines={1}
          style={[
            styles.value,
            { color: value ? theme.colors.text : theme.colors.textMuted },
          ]}
        >
          {value || placeholder}
        </Text>
        <Ionicons name="chevron-down" size={18} color={theme.colors.icon} />
      </Pressable>

      <Modal
        animationType="fade"
        onRequestClose={() => setPickerVisible(false)}
        transparent
        visible={isPickerVisible}
      >
        <View style={styles.modalRoot}>
          <Pressable
            accessibilityLabel={t("cancel")}
            style={[StyleSheet.absoluteFillObject, styles.backdrop]}
            onPress={() => setPickerVisible(false)}
          />
          <View
            style={[
              styles.picker,
              {
                backgroundColor: theme.colors.surfaceRaised,
                shadowColor: theme.colors.cardShadow,
              },
            ]}
          >
            <View style={styles.header}>
              <Text style={[styles.title, { color: theme.colors.text }]}>
                {t("selectTravelDate")}
              </Text>
              <TouchableOpacity
                accessibilityRole="button"
                accessibilityLabel={t("cancel")}
                activeOpacity={0.8}
                onPress={() => setPickerVisible(false)}
                style={[
                  styles.closeButton,
                  { backgroundColor: theme.colors.surfaceMuted },
                ]}
              >
                <Ionicons name="close" size={18} color={theme.colors.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.monthRow}>
              <TouchableOpacity
                accessibilityRole="button"
                accessibilityLabel={t("previousMonth")}
                activeOpacity={0.8}
                disabled={isPreviousMonthDisabled}
                onPress={() => goToMonth(-1)}
                style={[
                  styles.monthButton,
                  {
                    backgroundColor: theme.colors.surfaceMuted,
                    opacity: isPreviousMonthDisabled ? 0.4 : 1,
                  },
                ]}
              >
                <Ionicons name="chevron-back" size={18} color={theme.colors.text} />
              </TouchableOpacity>
              <Text style={[styles.monthTitle, { color: theme.colors.text }]}>
                {getMonthTitle(visibleMonth, language)}
              </Text>
              <TouchableOpacity
                accessibilityRole="button"
                accessibilityLabel={t("nextMonth")}
                activeOpacity={0.8}
                onPress={() => goToMonth(1)}
                style={[
                  styles.monthButton,
                  { backgroundColor: theme.colors.surfaceMuted },
                ]}
              >
                <Ionicons
                  name="chevron-forward"
                  size={18}
                  color={theme.colors.text}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.weekRow}>
              {weekLabels.map((weekLabel) => (
                <Text
                  key={weekLabel}
                  style={[styles.weekLabel, { color: theme.colors.textMuted }]}
                >
                  {weekLabel}
                </Text>
              ))}
            </View>

            <View style={styles.daysGrid}>
              {cells.map((cell) => (
                <View key={cell.key} style={styles.daySlot}>
                  {cell.day ? (
                    <TouchableOpacity
                      accessibilityRole="button"
                      activeOpacity={0.82}
                      disabled={cell.isDisabled}
                      onPress={() =>
                        handleSelectDate(cell.dateValue, cell.isDisabled)
                      }
                      style={[
                        styles.dayButton,
                        {
                          backgroundColor: cell.isSelected
                            ? theme.colors.primary
                            : "transparent",
                          opacity: cell.isDisabled ? 0.32 : 1,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.dayText,
                          {
                            color: cell.isSelected
                              ? theme.colors.white
                              : theme.colors.text,
                          },
                        ]}
                      >
                        {cell.day}
                      </Text>
                    </TouchableOpacity>
                  ) : null}
                </View>
              ))}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: "rgba(0, 0, 0, 0.44)",
  },
  closeButton: {
    alignItems: "center",
    borderRadius: radius.pill,
    height: 34,
    justifyContent: "center",
    width: 34,
  },
  dayButton: {
    alignItems: "center",
    borderRadius: radius.pill,
    height: 38,
    justifyContent: "center",
    width: 38,
  },
  daySlot: {
    alignItems: "center",
    height: 42,
    justifyContent: "center",
    width: "14.285%",
  },
  dayText: {
    fontSize: 14,
    fontWeight: "800",
  },
  daysGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: spacing.sm,
  },
  field: {
    alignItems: "center",
    borderRadius: radius.md,
    flexDirection: "row",
    minHeight: 56,
    paddingHorizontal: spacing.md,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.md,
  },
  label: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: spacing.xs,
  },
  leftIcon: {
    marginRight: spacing.sm,
  },
  modalRoot: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    padding: spacing.lg,
  },
  monthButton: {
    alignItems: "center",
    borderRadius: radius.pill,
    height: 38,
    justifyContent: "center",
    width: 38,
  },
  monthRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.md,
  },
  monthTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: "900",
    textAlign: "center",
    textTransform: "capitalize",
  },
  picker: {
    borderRadius: radius.lg,
    elevation: 12,
    maxWidth: 380,
    padding: spacing.lg,
    shadowOffset: {
      height: 14,
      width: 0,
    },
    shadowOpacity: 0.18,
    shadowRadius: 22,
    width: "100%",
  },
  title: {
    fontSize: 18,
    fontWeight: "900",
  },
  value: {
    flex: 1,
    fontSize: 16,
    fontWeight: "700",
  },
  weekLabel: {
    fontSize: 12,
    fontWeight: "900",
    textAlign: "center",
    width: "14.285%",
  },
  weekRow: {
    flexDirection: "row",
  },
});
