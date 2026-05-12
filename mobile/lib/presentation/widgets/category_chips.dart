import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/constants.dart';
import '../providers/filter_provider.dart';

class CategoryChips extends ConsumerWidget {
  const CategoryChips({super.key});

  static const _categories = [
    'All',
    'Elektronik',
    'Giyim',
    'Ev ve Yaşam',
    'Kozmetik',
    'Kitap',
  ];

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final currentCategory = ref.watch(filterProvider.select((s) => s.category));
    final notifier = ref.read(filterProvider.notifier);

    return SizedBox(
      height: 40,
      child: ListView.separated(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: AppSpacing.marginMobile),
        itemCount: _categories.length,
        separatorBuilder: (_, _) => const SizedBox(width: 8),
        itemBuilder: (context, index) {
          final category = _categories[index];
          final isSelected = category == currentCategory;

          return GestureDetector(
            onTap: () => notifier.setCategory(category),
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              decoration: BoxDecoration(
                color: isSelected ? AppColors.primary : AppColors.surfaceMuted,
                borderRadius: BorderRadius.circular(AppRadius.full),
              ),
              child: Center(
                child: Text(
                  category,
                  style: TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.w600,
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
