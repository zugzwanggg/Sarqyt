import 'package:flutter/material.dart';
import 'package:mobile/pages/login_page.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Sarqyt',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(
          surface: Colors.white,
          primary: const Color(0xFF3EC171),
          seedColor: Colors.green,
          brightness: Brightness.light
        ),
      ),
      home: LoginPage(),
    );
  }
}
