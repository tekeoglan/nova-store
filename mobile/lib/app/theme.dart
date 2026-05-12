import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../core/constants.dart';

class AppTheme {
  AppTheme._();

  static ThemeData get light {
    final manrope = GoogleFonts.manropeTextTheme();

    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.light,
      colorScheme: const ColorScheme.light(
        surface: AppColors.surface,
        primary: AppColors.primary,
        onPrimary: AppColors.onPrimary,
        onSurface: AppColors.onSurface,
        outline: AppColors.outline,
        error: AppColors.error,
        onError: AppColors.onError,
        secondary: AppColors.secondary,
        onSecondary: AppColors.onSecondary,
        tertiary: AppColors.tertiary,
        onTertiary: AppColors.onTertiary,
        inverseSurface: AppColors.inverseSurface,
        inversePrimary: AppColors.inversePrimary,
      ),

      textTheme: manrope.copyWith(
        displayLarge: manrope.displayLarge?.copyWith(
          fontFamily: 'Manrope',
          fontSize: 40,
          fontWeight: FontWeight.w700,
          height: 1.2,
        ),
        displayMedium: manrope.displayMedium?.copyWith(
          fontFamily: 'Manrope',
          fontSize: 32,
          fontWeight: FontWeight.w700,
          height: 1.2,
        ),
        displaySmall: manrope.displaySmall?.copyWith(
          fontFamily: 'Manrope',
          fontSize: 24,
          fontWeight: FontWeight.w600,
          height: 1.3,
        ),
        headlineLarge: manrope.headlineLarge?.copyWith(
          fontFamily: 'Manrope',
          fontSize: 28,
          fontWeight: FontWeight.w700,
          height: 1.2,
        ),
        bodyLarge: manrope.bodyLarge?.copyWith(
          fontFamily: 'Manrope',
          fontSize: 18,
          fontWeight: FontWeight.w400,
          height: 1.5,
        ),
        bodyMedium: manrope.bodyMedium?.copyWith(
          fontFamily: 'Manrope',
          fontSize: 16,
          fontWeight: FontWeight.w400,
          height: 1.5,
        ),
        bodySmall: manrope.bodySmall?.copyWith(
          fontFamily: 'Manrope',
          fontSize: 14,
          fontWeight: FontWeight.w400,
          height: 1.4,
        ),
        labelLarge: manrope.labelLarge?.copyWith(
          fontFamily: 'Manrope',
          fontSize: 14,
          fontWeight: FontWeight.w600,
          height: 1.2,
          letterSpacing: 0.02,
        ),
        labelSmall: manrope.labelSmall?.copyWith(
          fontFamily: 'Manrope',
          fontSize: 12,
          fontWeight: FontWeight.w500,
          height: 1.2,
        ),
      ),

      scaffoldBackgroundColor: AppColors.surface,
      appBarTheme: AppBarTheme(
        backgroundColor: AppColors.surfaceMain,
        foregroundColor: AppColors.onSurface,
        elevation: 0,
        scrolledUnderElevation: 1,
      ),

      cardTheme: CardThemeData(
        color: AppColors.surfaceMain,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(AppRadius.defaultRadius),
          side: const BorderSide(color: AppColors.surfaceContainerLow),
        ),
      ),

      chipTheme: ChipThemeData(
        backgroundColor: AppColors.surfaceMuted,
        selectedColor: AppColors.primary,
        labelStyle: TextStyle(color: AppColors.onSurface),
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(AppRadius.full),
        ),
      ),

      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: AppColors.surfaceMuted,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(AppRadius.full),
          borderSide: BorderSide.none,
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(AppRadius.full),
          borderSide: BorderSide.none,
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(AppRadius.full),
          borderSide: const BorderSide(color: AppColors.primary),
        ),
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      ),
    );
  }
}
