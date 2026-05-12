import 'package:flutter/material.dart';
import '../../core/constants.dart';

enum NovaButtonVariant { primary, secondary, outline, ghost }

class NovaButton extends StatelessWidget {
  final NovaButtonVariant variant;
  final String label;
  final Widget? icon;
  final bool isLoading;
  final VoidCallback? onPressed;
  final double? width;
  final EdgeInsetsGeometry? padding;

  const NovaButton({
    super.key,
    required this.label,
    this.variant = NovaButtonVariant.primary,
    this.icon,
    this.isLoading = false,
    this.onPressed,
    this.width,
    this.padding,
  });

  @override
  Widget build(BuildContext context) {
    Color backgroundColor;
    Color foregroundColor;
    Color borderColor = Colors.transparent;

    switch (variant) {
      case NovaButtonVariant.primary:
        backgroundColor = AppColors.primary;
        foregroundColor = AppColors.onPrimary;
      case NovaButtonVariant.secondary:
        backgroundColor = AppColors.accentEnergy;
        foregroundColor = Colors.white;
      case NovaButtonVariant.outline:
        backgroundColor = Colors.transparent;
        foregroundColor = AppColors.onSurface;
        borderColor = AppColors.outline;
      case NovaButtonVariant.ghost:
        backgroundColor = Colors.transparent;
        foregroundColor = AppColors.onSurface;
    }

    return SizedBox(
      width: width,
      child: Material(
        color: backgroundColor,
        borderRadius: BorderRadius.circular(AppRadius.defaultRadius),
        child: InkWell(
          onTap: (isLoading || onPressed == null) ? null : onPressed,
          borderRadius: BorderRadius.circular(AppRadius.defaultRadius),
          child: Container(
            padding: padding ??
                const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(AppRadius.defaultRadius),
              border: Border.all(color: borderColor),
            ),
            child: Center(
              child: isLoading
                  ? SizedBox(
                      width: 18,
                      height: 18,
                      child: CircularProgressIndicator(
                        strokeWidth: 2,
                        color: foregroundColor,
                      ),
                    )
                  : Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        if (icon != null) ...[
                          icon!,
                          const SizedBox(width: 8),
                        ],
                        Text(
                          label,
                          style: TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.w600,
                            color: foregroundColor,
                          ),
                        ),
                      ],
                    ),
            ),
          ),
        ),
      ),
    );
  }
}
