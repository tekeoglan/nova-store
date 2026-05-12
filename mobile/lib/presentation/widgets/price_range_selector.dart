import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/constants.dart';
import '../providers/filter_provider.dart';

class PriceRangeSelector extends ConsumerWidget {
  const PriceRangeSelector({super.key});

  static const _ranges = [
    PriceRange.all,
    PriceRange.range0to500,
    PriceRange.range500to2000,
    PriceRange.range2000to10000,
    PriceRange.range10000plus,
  ];

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final currentRange = ref.watch(filterProvider.select((s) => s.priceRange));
    final notifier = ref.read(filterProvider.notifier);

    return SizedBox(
      height: 36,
      child: ListView.separated(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: AppSpacing.marginMobile),
        itemCount: _ranges.length,
        separatorBuilder: (_, _) => const SizedBox(width: 8),
        itemBuilder: (context, index) {
          final range = _ranges[index];
          final isSelected = range == currentRange;

          return GestureDetector(
            onTap: () => notifier.setPriceRange(range),
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
              decoration: BoxDecoration(
                color: isSelected ? AppColors.primary : Colors.transparent,
                borderRadius: BorderRadius.circular(AppRadius.full),
                border: Border.all(
                  color: isSelected ? AppColors.primary : AppColors.outline,
                ),
              ),
              child: Center(
                child: Text(
                  range.label,
                  style: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.w500,
                    color: isSelected ? Colors.white : AppColors.onSurface,
                  ),
                ),
              ),
            ),
          );
        },
      ),
    );
  }
}
