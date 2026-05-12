import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:novastore/app/app.dart';

void main() {
  testWidgets('NovaStore app renders home screen', (tester) async {
    await tester.pumpWidget(
      const ProviderScope(
        child: NovaStoreApp(),
      ),
    );

    expect(find.text('NovaStore'), findsOneWidget);
  });
}
