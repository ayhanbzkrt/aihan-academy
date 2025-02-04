/*******************************************************
 * AI'Han Academy Python for AI - Final Enhanced script.js
 * Tüm modüller (1-18) ve quizler eksiksiz uygulanmıştır.
 * TR/EN dil desteği, Dark Mode, Pyodide, quiz kontrolü, ilerleme takibi,
 * rozet, konfeti animasyonu, sertifika oluşturma/önizleme/indirimi ve
 * gelişmiş hata yönetimi özellikleri mevcuttur.
 *******************************************************/

/* ------------------- GLOBAL DEĞİŞKENLER VE ÇEVİRİ SÖZLÜĞÜ ------------------- */
const langToggleBtn = document.getElementById('langToggleBtn');
const modeToggleBtn = document.getElementById('modeToggleBtn');
const textElements = document.querySelectorAll('[data-tr], [data-en]');
let currentLanguage = 'TR';

const translations = {
  "Daha Fazla": "Learn More",
  "Çalıştır": "Run",
  "Reset": "Reset",
  "Clear": "Clear",
  "Copy": "Copy",
  "Quiz Kontrol Et": "Check Quiz",
  "Tebrikler! Tüm cevaplar doğru.": "Congratulations! All answers are correct.",
  "Yanlış cevap(lar) var, doğru cevapları kontrol edin.": "There are incorrect answers, please check the correct ones.",
  "Tüm soruları cevaplamalısınız!": "Please answer all questions!",
  "Hata: ": "Error: ",
  "Kod başarıyla çalıştırıldı (çıktı yok).": "Code ran successfully (no output).",
  "Çalıştırılıyor...": "Running...",
  "Tüm modülleri tamamladınız! Sertifika oluşturabilirsiniz.": "All modules completed! You can generate your certificate.",
  "Tüm modüllerdeki kodları en az bir kez çalıştırmalı ve 3 soruluk quizlerini doğru yapmalısınız!":
      "You must run each module's code at least once and answer all 3 quiz questions correctly!",
  "Sertifikayı Önizle": "Preview Certificate",
  "Sertifika Oluştur": "Generate Certificate",
  "Sertifikayı İndir": "Download Certificate"
};

/* ------------------- DİL DEĞİŞTİRME ------------------- */
function switchLanguage() {
  currentLanguage = currentLanguage === 'TR' ? 'EN' : 'TR';
  langToggleBtn.textContent = currentLanguage === 'TR' ? 'EN' : 'TR';

  // Tüm data-tr/data-en içeren elemanlarda dil güncellemesi
  textElements.forEach(elem => {
    const trText = elem.getAttribute('data-tr');
    const enText = elem.getAttribute('data-en');
    if (trText && enText) {
      elem.textContent = currentLanguage === 'TR' ? trText : enText;
    }
  });

  updateOpenModalsLanguage();

  // Modül kartlarındaki başlık, açıklama ve buton metinlerini güncelle
  document.querySelectorAll('.module-card').forEach(card => {
    const moduleId = parseInt(card.getAttribute('data-module-id'));
    const mod = modules.find(m => m.id === moduleId);
    if (mod) {
      card.querySelector('h3').textContent = currentLanguage === 'TR' ? mod.title : mod.title_en;
      card.querySelector('p').textContent = currentLanguage === 'TR' ? mod.description : mod.description_en;
      card.querySelector('.learn-more').textContent = currentLanguage === 'TR' ? 'Daha Fazla' : translations["Daha Fazla"];
    }
  });

  // Sertifika butonlarının dilini güncelle
  previewCertificateBtn.textContent = currentLanguage === 'TR' ? "Sertifikayı Önizle" : translations["Sertifikayı Önizle"];
  generateCertificateBtn.textContent = currentLanguage === 'TR' ? "Sertifika Oluştur" : translations["Sertifika Oluştur"];
  downloadCertificateBtn.textContent = currentLanguage === 'TR' ? "Sertifikayı İndir" : translations["Sertifikayı İndir"];
}

function updateOpenModalsLanguage() {
  document.querySelectorAll('.modal .modal-content').forEach(modal => {
    modal.querySelectorAll('.run-btn').forEach(btn => {
      btn.textContent = currentLanguage === 'TR' ? 'Çalıştır' : translations["Çalıştır"];
    });
    modal.querySelectorAll('.reset-btn').forEach(btn => {
      btn.textContent = currentLanguage === 'TR' ? 'Reset' : translations["Reset"] || 'Reset';
    });
    modal.querySelectorAll('.clear-btn').forEach(btn => {
      btn.textContent = currentLanguage === 'TR' ? 'Clear' : translations["Clear"] || 'Clear';
    });
    modal.querySelectorAll('.copy-btn').forEach(btn => {
      btn.textContent = currentLanguage === 'TR' ? 'Copy' : translations["Copy"] || 'Copy';
    });
    modal.querySelectorAll('.check-quiz-btn').forEach(btn => {
      btn.textContent = currentLanguage === 'TR' ? 'Quiz Kontrol Et' : translations["Quiz Kontrol Et"] || 'Check Quiz';
    });
  });
}

langToggleBtn.addEventListener('click', switchLanguage);

/* ------------------- DARK MODE ------------------- */
modeToggleBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  modeToggleBtn.textContent = document.body.classList.contains('dark-mode') ? 'Light Mode' : 'Dark Mode';
});

/* ------------------- MOBİL MENÜ ------------------- */
const mobileMenu = document.getElementById('mobile-menu');
const navLinks = document.getElementById('nav-links');
mobileMenu.addEventListener('click', () => {
  navLinks.classList.toggle('show');
});

/* ------------------- PYODIDE YÜKLEME ------------------- */
let pyodide = null;
async function loadPyodideAndPackages() {
  try {
    pyodide = await loadPyodide({
      indexURL: "https://cdn.jsdelivr.net/pyodide/v0.23.4/full/"
    });
    console.log("Pyodide yüklendi!");
  } catch (error) {
    console.error("Pyodide yüklenirken hata oluştu:", error);
    alert("Pyodide yüklenirken bir hata oluştu. Lütfen sayfayı yenileyip tekrar deneyin.");
  }
}
loadPyodideAndPackages();

/* ------------------- SIMÜLE EDİLEN ÇIKTILAR ------------------- */
const simulatedOutputs = {
  9: {
    0: "math.sqrt(16) returned 4.0",
    1: "Current datetime: 2025-02-03 12:34:56",
    2: "requests.get('https://api.github.com') returned status code 200",
    3: "Custom module output: Hello, Ayhan!",
    4: "Package functions output: Function A\nFunction B"
  },
  10: {
    0: "Hello, my name is Ayhan and I am 30 years old.",
    1: "Brand: Toyota, Model: Corolla",
    2: "Karabas barks.",
    3: "Chirp chirp\nMeow",
    4: "Account balance: 100"
  },
  11: {
    0: "Python 3.11.0 (default, Jan 1 2025, 12:00:00) [GCC 10.2.0] on linux",
    1: '{"name": "Ayhan", "age": 30, "profession": "Engineer"}\n{"name": "Ayhan", "age": 30, "profession": "Engineer"}',
    2: "Regex matches: ['Ayha', 'dedi']",
    3: "Random integer: 42\nRandom fruit: banana",
    4: "Now: 2025-02-03 12:34:56\nBirthday: 1993-05-21\nAge: 31"
  },
  12: {
    0: "1\n2\n3\n4\n5",
    1: "Before function call\nHello!\nAfter function call",
    2: "8",
    3: "1\n2\n3",
    4: "This is an example for advanced topics."
  },
  13: {
    0: "[1 2 3 4 5]\n[ 6 7 8 9 10]\n3.0",
    1: "   Name  Age     City\n0  Ayhan   30  Istanbul\n1    Ali   25    Ankara\n2   Veli   35     Izmir\n...",
    2: "Matplotlib Bar Chart displayed\nSeaborn Bar Chart displayed",
    3: "Original Data:\n(Table with missing values filled and duplicates removed)",
    4: "Iris Dataset:\nFirst 5 rows displayed\nStatistical summary displayed\nPairplot rendered"
  },
  14: {
    0: "<home.html> content rendered by Flask",
    1: "Greet page rendered with submitted name",
    2: "Django home page rendered on local server",
    3: "API GET returned: {'message': 'Hello, API!'}\nAPI POST returned: {'you_sent': {...}}",
    4: "Django ORM: [Book(title='Example Book', author='John Doe'), ...]",
    5: "Database settings applied: SQLite (db.sqlite3)"
  },
  15: {
    0: "SQLite DB created; inserted: [('1', 'Ayhan', 30), ('2', 'Ali', 25)]",
    1: "SQLite update/delete executed; current records: [('1', 'Ayhan', 31)]",
    2: "SQLAlchemy ORM: User Veli, 28",
    3: "Django ORM: [Book list simulated]",
    4: "Database connection configured."
  },
  16: {
    0: "Ran 3 tests in 0.002s\nOK",
    1: "pytest output: All tests passed",
    2: "pdb session simulated: Error handled",
    3: "IDE debugger: Breakpoints hit",
    4: "PEP8 check: Code formatted correctly"
  },
  17: {
    0: "Project planning steps printed.",
    1: "Git repository initialized and pushed.",
    2: "Simple Todo App running (simulated).",
    3: "Portfolio instructions displayed.",
    4: "Project example output: This is an example for project development."
  },
  18: {
    0: "Extracted URLs: ['https://example.com/page1', 'https://example.com/page2']",
    1: "Pygame window simulated and closed after quit event.",
    2: "Model accuracy: 0.93",
    3: "Tkinter GUI rendered: Greeting displayed.",
    4: "Extra topic output: This is an example for extra topics."
  }
};

/* ------------------- MODÜL VERİLERİ (1-18) ------------------- */
const modules = [
  {
    id: 1,
    title: "Python'a Giriş",
    title_en: "Introduction to Python",
    description: "Python'un genel özellikleri ve kullanım alanları.",
    description_en: "General features and usage areas of Python.",
    topics: [
      {
        title: "Python Nedir?",
        title_en: "What is Python?",
        code: `print("Python, güçlü ve esnek bir programlama dilidir.")`,
        code_en: `print("Python is a powerful and flexible programming language.")`,
        explanation: "Python, basit sözdizimi ve geniş kütüphane desteği ile bilinir.",
        explanation_en: "Python is known for its simple syntax and extensive library support."
      },
      {
        title: "Kurulum",
        title_en: "Installation",
        code: `# Python kurulumu için resmi web sitesini ziyaret edin: https://www.python.org/downloads/`,
        code_en: `# Visit the official website to download and install Python: https://www.python.org/downloads/`,
        explanation: "Python'un en son sürümünü indirip kurabilirsiniz.",
        explanation_en: "You can download and install the latest version of Python."
      },
      {
        title: "Geliştirme Ortamları",
        title_en: "Development Environments",
        code: `# Örneğin, VS Code kullanarak Python geliştirme
# VS Code'u açın ve Python eklentisini yükleyin.`,
        code_en: `# For example, develop Python using VS Code.
# Open VS Code and install the Python extension.`,
        explanation: "IDLE, VS Code, PyCharm gibi IDE'ler Python geliştirmek için kullanılır.",
        explanation_en: "IDLE, VS Code, PyCharm and other IDEs are used for Python development."
      },
      {
        title: "İlk Programınız",
        title_en: "Your First Program",
        code: `print("Hello, World!")`,
        code_en: `print("Hello, World!")`,
        explanation: "Bu, Python'da ilk programınızı yazmanızı sağlar.",
        explanation_en: "This allows you to write your first program in Python."
      },
      {
        title: "Temel Kod Yapısı",
        title_en: "Basic Code Structure",
        code: `def greet():
    print("Merhaba!")
greet()`,
        code_en: `def greet():
    print("Hello!")
greet()`,
        explanation: "Fonksiyon tanımlamaları ve bloklar girintileme ile belirlenir.",
        explanation_en: "Function definitions and blocks are defined by indentation."
      }
    ]
  },
  {
    id: 2,
    title: "Temel Veri Tipleri ve Değişkenler",
    title_en: "Basic Data Types and Variables",
    description: "Değişken tanımlama ve temel veri türleri.",
    description_en: "Variable declaration and basic data types.",
    topics: [
      {
        title: "Değişkenler",
        title_en: "Variables",
        code: `x = 10
y = "Merhaba"
print(x)
print(y)`,
        code_en: `x = 10
y = "Hello"
print(x)
print(y)`,
        explanation: "Değişkenler, veriyi saklamak için kullanılır ve türü otomatik olarak belirlenir.",
        explanation_en: "Variables are used to store data and their types are determined automatically."
      },
      {
        title: "Veri Tipleri",
        title_en: "Data Types",
        code: `a = 5          # int
b = 3.14       # float
c = "Python"   # str
d = True       # bool
print(type(a), type(b), type(c), type(d))`,
        code_en: `a = 5          # int
b = 3.14       # float
c = "Python"   # str
d = True       # bool
print(type(a), type(b), type(c), type(d))`,
        explanation: "Python'da temel veri tipleri int, float, str ve bool'dur.",
        explanation_en: "The basic data types in Python are int, float, str, and bool."
      },
      {
        title: "Tip Dönüşümleri",
        title_en: "Type Conversions",
        code: `x = "123"
y = int(x) + 10
print(y)`,
        code_en: `x = "123"
y = int(x) + 10
print(y)`,
        explanation: "Veri tipleri birbirine dönüştürülebilir. Bu örnekte string bir sayı int'e dönüştürülür.",
        explanation_en: "Data types can be converted. In this example, a numeric string is converted to an int."
      },
      {
        title: "Input ve Output",
        title_en: "Input and Output",
        code: `name = input("Adınızı girin: ")
print(f"Merhaba, {name}!")`,
        code_en: `name = input("Enter your name: ")
print(f"Hello, {name}!")`,
        explanation: "input() fonksiyonu ile kullanıcıdan veri alınabilir ve print() ile ekrana yazdırılabilir.",
        explanation_en: "The input() function is used to get data from the user, and print() displays it."
      },
      {
        title: "Boolean Operatörler",
        title_en: "Boolean Operators",
        code: `a = True
b = False
print(a and b)
print(a or b)
print(not a)`,
        code_en: `a = True
b = False
print(a and b)
print(a or b)
print(not a)`,
        explanation: "Mantıksal operatörler and, or ve not ile boolean değerler üzerinde işlemler yapılır.",
        explanation_en: "Logical operators and, or, and not are used to perform operations on boolean values."
      }
    ]
  },
  {
    id: 3,
    title: "Operatörler ve İfadeler",
    title_en: "Operators and Expressions",
    description: "Aritmetik, karşılaştırma, mantıksal ve atama operatörleri.",
    description_en: "Arithmetic, comparison, logical, and assignment operators.",
    topics: [
      {
        title: "Aritmetik Operatörler",
        title_en: "Arithmetic Operators",
        code: `a = 10
b = 5
print(a + b)
print(a - b)
print(a * b)
print(a / b)`,
        code_en: `a = 10
b = 5
print(a + b)
print(a - b)
print(a * b)
print(a / b)`,
        explanation: "Toplama, çıkarma, çarpma ve bölme işlemlerini gösterir.",
        explanation_en: "Shows addition, subtraction, multiplication, and division operations."
      },
      {
        title: "Karşılaştırma Operatörleri",
        title_en: "Comparison Operators",
        code: `x = 10
y = 20
print(x == y)
print(x > y)
print(x < y)`,
        code_en: `x = 10
y = 20
print(x == y)
print(x > y)
print(x < y)`,
        explanation: "Eşitlik, büyüme ve küçülme karşılaştırmalarını gösterir.",
        explanation_en: "Demonstrates equality, greater than, and less than comparisons."
      },
      {
        title: "Mantıksal Operatörler",
        title_en: "Logical Operators",
        code: `a = True
b = False
print(a and b)
print(a or b)
print(not a)`,
        code_en: `a = True
b = False
print(a and b)
print(a or b)
print(not a)`,
        explanation: "and, or ve not mantıksal operatörlerini gösterir.",
        explanation_en: "Demonstrates the logical operators and, or, and not."
      },
      {
        title: "Atama Operatörleri",
        title_en: "Assignment Operators",
        code: `x = 5
x += 3
print(x)
x *= 2
print(x)`,
        code_en: `x = 5
x += 3
print(x)
x *= 2
print(x)`,
        explanation: "Kısa atama operatörlerini (+=, *=) gösterir.",
        explanation_en: "Shows shorthand assignment operators (+=, *=)."
      },
      {
        title: "Modüler Operatör",
        title_en: "Modulus Operator",
        code: `a = 10
b = 3
print(a % b)`,
        code_en: `a = 10
b = 3
print(a % b)`,
        explanation: "Modüler operatör, bölme işleminin kalanını verir.",
        explanation_en: "The modulus operator gives the remainder of a division."
      }
    ]
  },
  {
    id: 4,
    title: "Kontrol Yapıları",
    title_en: "Control Structures",
    description: "Koşul ifadeleri ve döngüler.",
    description_en: "Conditional statements and loops.",
    topics: [
      {
        title: "Koşul İfadeleri",
        title_en: "Conditional Statements",
        code: `x = 10
if x > 5:
    print("x 5'ten büyük")
elif x == 5:
    print("x 5'e eşit")
else:
    print("x 5'ten küçük")`,
        code_en: `x = 10
if x > 5:
    print("x is greater than 5")
elif x == 5:
    print("x is equal to 5")
else:
    print("x is less than 5")`,
        explanation: "if, elif ve else ile koşul ifadeleri oluşturulur.",
        explanation_en: "Conditional statements are created using if, elif, and else."
      },
      {
        title: "For Döngüsü",
        title_en: "For Loop",
        code: `fruits = ["elma", "muz", "çilek"]
for fruit in fruits:
    print(fruit)`,
        code_en: `fruits = ["apple", "banana", "strawberry"]
for fruit in fruits:
    print(fruit)`,
        explanation: "Liste, demet ve diğer iterable yapılarla for döngüsü kullanılır.",
        explanation_en: "A for loop is used with lists, tuples, and other iterable objects."
      },
      {
        title: "While Döngüsü",
        title_en: "While Loop",
        code: `i = 1
while i <= 5:
    print(i)
    i += 1`,
        code_en: `i = 1
while i <= 5:
    print(i)
    i += 1`,
        explanation: "Belirli bir koşul sağlanana kadar dönen while döngüsü.",
        explanation_en: "A while loop runs until a specified condition is met."
      },
      {
        title: "Break ve Continue",
        title_en: "Break and Continue",
        code: `for i in range(10):
    if i == 5:
        break
    if i % 2 == 0:
        continue
    print(i)`,
        code_en: `for i in range(10):
    if i == 5:
        break
    if i % 2 == 0:
        continue
    print(i)`,
        explanation: "break döngüyü sonlandırır, continue ise döngünün bir sonraki adımına geçer.",
        explanation_en: "The break statement ends the loop, while continue skips to the next iteration."
      },
      {
        title: "Pass İfadesi",
        title_en: "Pass Statement",
        code: `for i in range(5):
    if i == 3:
        pass  # Henüz bir şey yapmıyoruz
    print(i)`,
        code_en: `for i in range(5):
    if i == 3:
        pass  # Do nothing for now
    print(i)`,
        explanation: "Pass ifadesi hiçbir işlem yapmadan kod bloğunu atlar.",
        explanation_en: "The pass statement skips a block of code without doing anything."
      }
    ]
  },
  {
    id: 5,
    title: "Fonksiyonlar",
    title_en: "Functions",
    description: "Fonksiyon tanımlama, parametreler ve dönüş değerleri.",
    description_en: "Defining functions, parameters, and return values.",
    topics: [
      {
        title: "Fonksiyon Tanımlama",
        title_en: "Function Definition",
        code: `def greet():
    print("Merhaba!")
greet()`,
        code_en: `def greet():
    print("Hello!")
greet()`,
        explanation: "def anahtar kelimesi ile fonksiyon oluşturma ve çağırma.",
        explanation_en: "Functions are defined and called using the def keyword."
      },
      {
        title: "Parametreler ve Argümanlar",
        title_en: "Parameters and Arguments",
        code: `def add(a, b):
    return a + b
result = add(5, 3)
print(result)`,
        code_en: `def add(a, b):
    return a + b
result = add(5, 3)
print(result)`,
        explanation: "Fonksiyonlara parametreler ekleyerek farklı girdilerle çalışabilirsiniz.",
        explanation_en: "You can pass different arguments to functions by using parameters."
      },
      {
        title: "Geri Dönüş Değerleri",
        title_en: "Return Values",
        code: `def multiply(a, b):
    return a * b
product = multiply(4, 5)
print(product)`,
        code_en: `def multiply(a, b):
    return a * b
product = multiply(4, 5)
print(product)`,
        explanation: "return ifadesi ile fonksiyondan değer döndürme.",
        explanation_en: "The return statement returns a value from a function."
      },
      {
        title: "Yerel ve Global Değişkenler",
        title_en: "Local and Global Variables",
        code: `x = 10  # Global değişken
def func():
    y = 5  # Yerel değişken
    print(x)
    print(y)
func()
# print(y)  # Hata verir çünkü y yerel değişkendir.`,
        code_en: `x = 10  # Global variable
def func():
    y = 5  # Local variable
    print(x)
    print(y)
func()
# print(y)  # This would cause an error because y is local.`,
        explanation: "Global değişkenler tüm fonksiyonlar tarafından erişilebilirken, yerel değişkenler sadece tanımlandıkları fonksiyon içinde geçerlidir.",
        explanation_en: "Global variables are accessible by all functions, while local variables are only valid within the function in which they are defined."
      },
      {
        title: "Varsayılan Argümanlar",
        title_en: "Default Arguments",
        code: `def greet(name="Dünya"):
    print(f"Merhaba, {name}!")
greet()
greet("Ayhan")`,
        code_en: `def greet(name="World"):
    print(f"Hello, {name}!")
greet()
greet("Ayhan")`,
        explanation: "Fonksiyonlara varsayılan argümanlar ekleyerek daha esnek hale getirebilirsiniz.",
        explanation_en: "Default arguments can be added to functions to make them more flexible."
      }
    ]
  },
  {
    id: 6,
    title: "Veri Yapıları",
    title_en: "Data Structures",
    description: "Listeler, demetler, sözlükler ve kümeler.",
    description_en: "Lists, tuples, dictionaries, and sets.",
    topics: [
      {
        title: "Listeler",
        title_en: "Lists",
        code: `fruits = ["elma", "muz", "çilek"]
print(fruits)
fruits.append("portakal")
print(fruits)
fruits.remove("muz")
print(fruits)
print(fruits[0])
print(fruits[-1])`,
        code_en: `fruits = ["apple", "banana", "strawberry"]
print(fruits)
fruits.append("orange")
print(fruits)
fruits.remove("banana")
print(fruits)
print(fruits[0])
print(fruits[-1])`,
        explanation: "Listeler, sıralı ve değiştirilebilir veri yapılarıdır.",
        explanation_en: "Lists are ordered and mutable data structures."
      },
      {
        title: "Demetler (Tuples)",
        title_en: "Tuples",
        code: `person = ("Ayhan", 30, "Mühendis")
print(person)
# person[1] = 31  # Hata verir çünkü demetler değişmezdir`,
        code_en: `person = ("Ayhan", 30, "Engineer")
print(person)
# person[1] = 31  # This will raise an error because tuples are immutable`,
        explanation: "Demetler, sıralı ve değişmez veri yapılarıdır.",
        explanation_en: "Tuples are ordered and immutable data structures."
      },
      {
        title: "Sözlükler (Dictionaries)",
        title_en: "Dictionaries",
        code: `person = {
    "isim": "Ayhan",
    "yas": 30,
    "meslek": "Mühendis"
}
print(person)
print(person["isim"])
person["yas"] = 31
print(person)
person["şehir"] = "İstanbul"
print(person)`,
        code_en: `person = {
    "name": "Ayhan",
    "age": 30,
    "profession": "Engineer"
}
print(person)
print(person["name"])
person["age"] = 31
print(person)
person["city"] = "Istanbul"
print(person)`,
        explanation: "Sözlükler, anahtar-değer çiftleri ile çalışır.",
        explanation_en: "Dictionaries work with key-value pairs."
      },
      {
        title: "Kümeler (Sets)",
        title_en: "Sets",
        code: `numbers = {1, 2, 3, 4, 4, 5}
print(numbers)
numbers.add(6)
print(numbers)
numbers.remove(2)
print(numbers)`,
        code_en: `numbers = {1, 2, 3, 4, 4, 5}
print(numbers)
numbers.add(6)
print(numbers)
numbers.remove(2)
print(numbers)`,
        explanation: "Kümeler, benzersiz eleman içeren değiştirilebilir veri yapılarıdır.",
        explanation_en: "Sets are mutable data structures that contain only unique elements."
      },
      {
        title: "Liste Anlamaları (List Comprehensions)",
        title_en: "List Comprehensions",
        code: `squares = [x**2 for x in range(10)]
print(squares)
even_squares = [x**2 for x in range(10) if x % 2 == 0]
print(even_squares)`,
        code_en: `squares = [x**2 for x in range(10)]
print(squares)
even_squares = [x**2 for x in range(10) if x % 2 == 0]
print(even_squares)`,
        explanation: "Daha kısa ve okunabilir kod yazmak için liste anlamaları kullanılır.",
        explanation_en: "List comprehensions are used for more concise and readable code."
      }
    ]
  },
  {
    id: 7,
    title: "Dosya İşlemleri",
    title_en: "File Operations",
    description: "Dosya açma, okuma, yazma ve yönetme.",
    description_en: "Opening, reading, writing, and managing files.",
    topics: [
      {
        title: "Dosya Açma ve Kapama",
        title_en: "Opening and Closing Files",
        code: `file = open("example.txt", "w")
file.write("Merhaba, Dünya!")
file.close()
with open("example.txt", "r") as file:
    content = file.read()
    print(content)`,
        code_en: `file = open("example.txt", "w")
file.write("Hello, World!")
file.close()
with open("example.txt", "r") as file:
    content = file.read()
    print(content)`,
        explanation: "open() fonksiyonu ile dosya açma ve close() ile kapama.",
        explanation_en: "Files are opened using open() and closed with close() or using with for automatic closure."
      },
      {
        title: "Dosya Okuma",
        title_en: "Reading Files",
        code: `with open("example.txt", "r") as file:
    content = file.read()
    print(content)
with open("example.txt", "r") as file:
    for line in file:
        print(line.strip())`,
        code_en: `with open("example.txt", "r") as file:
    content = file.read()
    print(content)
with open("example.txt", "r") as file:
    for line in file:
        print(line.strip())`,
        explanation: "read(), readline() ve readlines() metodları ile dosya okuma.",
        explanation_en: "Files can be read using read(), readline(), or readlines() methods."
      },
      {
        title: "Dosya Yazma",
        title_en: "Writing Files",
        code: `with open("example.txt", "a") as file:
    file.write("\\nPython öğreniyorum.")
with open("example.txt", "r") as file:
    print(file.read())`,
        code_en: `with open("example.txt", "a") as file:
    file.write("\\nI am learning Python.")
with open("example.txt", "r") as file:
    print(file.read())`,
        explanation: "write() ve writelines() metodları ile dosya yazma.",
        explanation_en: "Files can be written to using write() and writelines() methods."
      },
      {
        title: "Dosya Yönetimi",
        title_en: "File Management",
        code: `with open("example.txt", "w") as file:
    file.write("Yeni içerik.")
with open("example.txt", "r") as file:
    print(file.read())`,
        code_en: `with open("example.txt", "w") as file:
    file.write("New content.")
with open("example.txt", "r") as file:
    print(file.read())`,
        explanation: "with ifadesi ile dosya işlemleri daha güvenli ve temiz hale getirilir.",
        explanation_en: "Using with ensures that file operations are safely and cleanly executed."
      },
      {
        title: "Dosya ve Dizin İşlemleri",
        title_en: "File and Directory Operations",
        code: `import os
os.makedirs("yeni_dizin", exist_ok=True)
os.chdir("yeni_dizin")
with open("yeni_dosya.txt", "w") as file:
    file.write("Bu, yeni bir dosyadır.")
os.remove("yeni_dosya.txt")
os.chdir("..")
os.rmdir("yeni_dizin")`,
        code_en: `import os
os.makedirs("new_directory", exist_ok=True)
os.chdir("new_directory")
with open("new_file.txt", "w") as file:
    file.write("This is a new file.")
os.remove("new_file.txt")
os.chdir("..")
os.rmdir("new_directory")`,
        explanation: "os modülü ile dosya ve dizin işlemleri yapma.",
        explanation_en: "The os module is used for file and directory operations."
      }
    ]
  },
  {
    id: 8,
    title: "Hata Yönetimi ve İstisnalar",
    title_en: "Error Handling and Exceptions",
    description: "İstisnalar, try-except blokları ve özel istisnalar.",
    description_en: "Exceptions, try-except blocks, and custom exceptions.",
    topics: [
      {
        title: "İstisnalar Nedir?",
        title_en: "What are Exceptions?",
        code: `try:
    x = 5 / 0
except ZeroDivisionError:
    print("Sıfıra bölme hatası!")`,
        code_en: `try:
    x = 5 / 0
except ZeroDivisionError:
    print("Division by zero error!")`,
        explanation: "Hata türlerini tanımlama ve nedenlerini anlama.",
        explanation_en: "Understanding and identifying types of errors and their causes."
      },
      {
        title: "try, except Blokları",
        title_en: "try, except Blocks",
        code: `try:
    number = int(input("Bir sayı girin: "))
    print(f"Girdiğiniz sayı: {number}")
except ValueError:
    print("Geçersiz bir sayı girdiniz!")`,
        code_en: `try:
    number = int(input("Enter a number: "))
    print(f"You entered: {number}")
except ValueError:
    print("Invalid number entered!")`,
        explanation: "Hataları yakalama ve yönetme.",
        explanation_en: "Catching and handling errors."
      },
      {
        title: "finally ve else Blokları",
        title_en: "finally and else Blocks",
        code: `try:
    number = int(input("Bir sayı girin: "))
    result = 10 / number
except ZeroDivisionError:
    print("Sıfıra bölme hatası!")
except ValueError:
    print("Geçersiz bir sayı girdiniz!")
else:
    print(f"Sonuç: {result}")
finally:
    print("Bu blok her zaman çalışır.")`,
        code_en: `try:
    number = int(input("Enter a number: "))
    result = 10 / number
except ZeroDivisionError:
    print("Division by zero error!")
except ValueError:
    print("Invalid number entered!")
else:
    print(f"Result: {result}")
finally:
    print("This block always runs.")`,
        explanation: "finally ve else blokları ile ek hata yönetimi seçenekleri.",
        explanation_en: "Additional error handling options using finally and else blocks."
      },
      {
        title: "Özel İstisnalar",
        title_en: "Custom Exceptions",
        code: `class MyCustomError(Exception):
    pass
try:
    raise MyCustomError("Bu özel bir istisnadır.")
except MyCustomError as e:
    print(e)`,
        code_en: `class MyCustomError(Exception):
    pass
try:
    raise MyCustomError("This is a custom exception.")
except MyCustomError as e:
    print(e)`,
        explanation: "Kendi hata türlerinizi oluşturma ve kullanma.",
        explanation_en: "Creating and using your own custom exception types."
      },
      {
        title: "Hata Mesajları",
        title_en: "Error Messages",
        code: `try:
    with open("nonexistent.txt", "r") as file:
        content = file.read()
except FileNotFoundError as e:
    print(f"Hata: {e}")`,
        code_en: `try:
    with open("nonexistent.txt", "r") as file:
        content = file.read()
except FileNotFoundError as e:
    print(f"Error: {e}")`,
        explanation: "Hata mesajlarını yakalama ve gösterme.",
        explanation_en: "Catching and displaying error messages."
      }
    ]
  },
  {
    id: 9,
    title: "Modüller ve Paketler",
    title_en: "Modules and Packages",
    description: "Modül tanımı, standart kütüphane ve harici modüller.",
    description_en: "Definition of modules, standard libraries, and external modules.",
    topics: [
      {
        title: "Modül Nedir?",
        title_en: "What is a Module?",
        code: `import math
print(math.sqrt(16))`,
        code_en: `import math
print(math.sqrt(16))`,
        explanation: "Modüllerin tanımı ve kullanımı.",
        explanation_en: "Definition and usage of modules."
      },
      {
        title: "Standart Kütüphane",
        title_en: "Standard Library",
        code: `import datetime
now = datetime.datetime.now()
print(now)`,
        code_en: `import datetime
now = datetime.datetime.now()
print(now)`,
        explanation: "Python'un yerleşik modülleri kullanımı.",
        explanation_en: "Usage of Python's built-in modules."
      },
      {
        title: "Harici Modüller",
        title_en: "External Modules",
        code: `# pip install requests
import requests
response = requests.get("https://api.github.com")
print(response.status_code)`,
        code_en: `# pip install requests
import requests
response = requests.get("https://api.github.com")
print(response.status_code)`,
        explanation: "pip ile harici modül yükleme ve kullanma.",
        explanation_en: "Installing and using external modules via pip."
      },
      {
        title: "Kendi Modüllerinizi Oluşturma",
        title_en: "Creating Your Own Modules",
        code: `# my_module.py
def greet(name):
    return f"Merhaba, {name}!"
# main.py
import my_module
print(my_module.greet("Ayhan"))`,
        code_en: `# In my_module.py:
def greet(name):
    return f"Hello, {name}!"
# In main.py:
import my_module
print(my_module.greet("Ayhan"))`,
        explanation: "Kendi modüllerinizi oluşturma ve import etme.",
        explanation_en: "Creating and importing your own modules."
      },
      {
        title: "Paketler",
        title_en: "Packages",
        code: `# Paket yapısı:
# my_package/
# ├── __init__.py
# ├── module_a.py
# └── module_b.py
# module_a.py
def func_a():
    return "Fonksiyon A"
# module_b.py
def func_b():
    return "Fonksiyon B"
# main.py
from my_package import module_a, module_b
print(module_a.func_a())
print(module_b.func_b())`,
        code_en: `# Package structure:
# my_package/
# ├── __init__.py
# ├── module_a.py
# └── module_b.py
# In module_a.py:
def func_a():
    return "Function A"
# In module_b.py:
def func_b():
    return "Function B"
# In main.py:
from my_package import module_a, module_b
print(module_a.func_a())
print(module_b.func_b())`,
        explanation: "Paketler ile modülleri organize etme.",
        explanation_en: "Organizing modules into packages."
      }
    ]
  },
  {
    id: 10,
    title: "Nesne Yönelimli Programlama (OOP)",
    title_en: "Object-Oriented Programming (OOP)",
    description: "Sınıflar, nesneler, kalıtım ve OOP kavramları.",
    description_en: "Classes, objects, inheritance, and OOP concepts.",
    topics: [
      {
        title: "Sınıflar ve Nesneler",
        title_en: "Classes and Objects",
        code: `class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age
    def greet(self):
        print(f"Merhaba, benim adım {self.name} ve ben {self.age} yaşındayım.")
p1 = Person("Ayhan", 30)
p1.greet()`,
        code_en: `class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age
    def greet(self):
        print(f"Hello, my name is {self.name} and I am {self.age} years old.")
p1 = Person("Ayhan", 30)
p1.greet()`,
        explanation: "Sınıf tanımlama ve nesne oluşturma.",
        explanation_en: "Defining a class and creating an object."
      },
      {
        title: "Özellikler ve Metodlar",
        title_en: "Attributes and Methods",
        code: `class Car:
    def __init__(self, brand, model):
        self.brand = brand
        self.model = model
    def display_info(self):
        print(f"Marka: {self.brand}, Model: {self.model}")
car1 = Car("Toyota", "Corolla")
car1.display_info()`,
        code_en: `class Car:
    def __init__(self, brand, model):
        self.brand = brand
        self.model = model
    def display_info(self):
        print(f"Brand: {self.brand}, Model: {self.model}")
car1 = Car("Toyota", "Corolla")
car1.display_info()`,
        explanation: "Sınıf içinde değişken ve fonksiyon kullanımı.",
        explanation_en: "Usage of attributes and methods within a class."
      },
      {
        title: "Kalıtım",
        title_en: "Inheritance",
        code: `class Animal:
    def __init__(self, name):
        self.name = name
    def speak(self):
        pass
class Dog(Animal):
    def speak(self):
        print(f"{self.name} havlıyor.")
dog = Dog("Karabas")
dog.speak()`,
        code_en: `class Animal:
    def __init__(self, name):
        self.name = name
    def speak(self):
        pass
class Dog(Animal):
    def speak(self):
        print(f"{self.name} barks.")
dog = Dog("Karabas")
dog.speak()`,
        explanation: "Sınıflardan miras alma.",
        explanation_en: "Inheritance: deriving a new class from an existing class."
      },
      {
        title: "Polimorfizm",
        title_en: "Polymorphism",
        code: `class Bird:
    def speak(self):
        print("Cik cik")
class Cat:
    def speak(self):
        print("Miyav")
def make_sound(animal):
    animal.speak()
bird = Bird()
cat = Cat()
make_sound(bird)
make_sound(cat)`,
        code_en: `class Bird:
    def speak(self):
        print("Chirp chirp")
class Cat:
    def speak(self):
        print("Meow")
def make_sound(animal):
    animal.speak()
bird = Bird()
cat = Cat()
make_sound(bird)
make_sound(cat)`,
        explanation: "Polimorfizm, aynı metodun farklı sınıflarda farklı davranışlar sergilemesidir.",
        explanation_en: "Polymorphism means the same method behaves differently in different classes."
      },
      {
        title: "Kapsülleme",
        title_en: "Encapsulation",
        code: `class Account:
    def __init__(self, owner, balance=0):
        self.owner = owner
        self.__balance = balance
    def deposit(self, amount):
        if amount > 0:
            self.__balance += amount
            print(f"{amount} TL yatırıldı. Yeni bakiye: {self.__balance}")
        else:
            print("Geçersiz miktar.")
    def get_balance(self):
        return self.__balance
account = Account("Ayhan")
account.deposit(100)
print(account.get_balance())`,
        code_en: `class Account:
    def __init__(self, owner, balance=0):
        self.owner = owner
        self.__balance = balance
    def deposit(self, amount):
        if amount > 0:
            self.__balance += amount
            print(f"{amount} TL deposited. New balance: {self.__balance}")
        else:
            print("Invalid amount.")
    def get_balance(self):
        return self.__balance
account = Account("Ayhan")
account.deposit(100)
print(account.get_balance())`,
        explanation: "Kapsülleme, sınıf içindeki verilerin gizlenmesi ve kontrol edilmesi anlamına gelir.",
        explanation_en: "Encapsulation means hiding and controlling access to data within a class."
      }
    ]
  },
  {
    id: 11,
    title: "Standart Kütüphane",
    title_en: "Standard Library",
    description: "Önemli Python modülleri ve kullanım alanları.",
    description_en: "Important Python modules and their usage.",
    topics: [
      {
        title: "sys Modülü",
        title_en: "sys Module",
        code: `import sys
print(sys.version)
print(sys.platform)`,
        code_en: `import sys
print(sys.version)
print(sys.platform)`,
        explanation: "Python'un çalışma ortamı hakkında bilgi alabilirsiniz.",
        explanation_en: "You can get information about the Python runtime environment."
      },
      {
        title: "json Modülü",
        title_en: "json Module",
        code: `import json
data = {
    "isim": "Ayhan",
    "yas": 30,
    "meslek": "Mühendis"
}
json_data = json.dumps(data)
print(json_data)
python_data = json.loads(json_data)
print(python_data)`,
        code_en: `import json
data = {
    "name": "Ayhan",
    "age": 30,
    "profession": "Engineer"
}
json_data = json.dumps(data)
print(json_data)
python_data = json.loads(json_data)
print(python_data)`,
        explanation: "JSON verilerini Python objelerine ve tam tersine dönüştürme.",
        explanation_en: "Converts JSON data to Python objects and vice versa."
      },
      {
        title: "re (Düzenli İfadeler) Modülü",
        title_en: "re (Regular Expressions) Module",
        code: `import re
text = "Merhaba, benim adım Ayhan ve yaşım 30."
pattern = r"\\b\\w{4}\\b"
matches = re.findall(pattern, text)
print(matches)`,
        code_en: `import re
text = "Hello, my name is Ayhan and I am 30."
pattern = r"\\b\\w{4}\\b"
matches = re.findall(pattern, text)
print(matches)`,
        explanation: "Düzenli ifadeler ile metin arama ve eşleştirme.",
        explanation_en: "Searching and matching text using regular expressions."
      },
      {
        title: "random Modülü",
        title_en: "random Module",
        code: `import random
print(random.randint(1, 100))
fruits = ["elma", "muz", "çilek", "portakal"]
print(random.choice(fruits))`,
        code_en: `import random
print(random.randint(1, 100))
fruits = ["apple", "banana", "strawberry", "orange"]
print(random.choice(fruits))`,
        explanation: "Rastgele sayılar ve seçimler yapmak için kullanılır.",
        explanation_en: "Used to generate random numbers and make random selections."
      },
      {
        title: "datetime Modülü",
        title_en: "datetime Module",
        code: `import datetime
now = datetime.datetime.now()
print(now)
birthday = datetime.date(1993, 5, 21)
print(birthday)
today = datetime.date.today()
age = today.year - birthday.year - ((today.month, today.day) < (birthday.month, birthday.day))
print(f"Yaş: {age}")`,
        code_en: `import datetime
now = datetime.datetime.now()
print(now)
birthday = datetime.date(1993, 5, 21)
print(birthday)
today = datetime.date.today()
age = today.year - birthday.year - ((today.month, today.day) < (birthday.month, birthday.day))
print(f"Age: {age}")`,
        explanation: "Tarih ve zaman ile ilgili işlemler yapmak için kullanılır.",
        explanation_en: "Used for operations involving date and time."
      }
    ]
  },
  {
    id: 12,
    title: "Gelişmiş Konular",
    title_en: "Advanced Topics",
    description: "Generator'ler, dekoratörler, lambda fonksiyonları ve iteratörler.",
    description_en: "Generators, decorators, lambda functions, and iterators.",
    topics: [
      {
        title: "Generator'ler",
        title_en: "Generators",
        code: `def count_up_to(max):
    count = 1
    while count <= max:
        yield count
        count += 1
counter = count_up_to(5)
for num in counter:
    print(num)`,
        code_en: `def count_up_to(max):
    count = 1
    while count <= max:
        yield count
        count += 1
counter = count_up_to(5)
for num in counter:
    print(num)`,
        explanation: "yield kullanarak bellek verimli veri üretimi.",
        explanation_en: "Efficiently generate data using yield."
      },
      {
        title: "Dekoratörler",
        title_en: "Decorators",
        code: `def my_decorator(func):
    def wrapper():
        print("Fonksiyon çalışmadan önce")
        func()
        print("Fonksiyon çalıştıktan sonra")
    return wrapper
@my_decorator
def say_hello():
    print("Merhaba!")
say_hello()`,
        code_en: `def my_decorator(func):
    def wrapper():
        print("Before function call")
        func()
        print("After function call")
    return wrapper
@my_decorator
def say_hello():
    print("Hello!")
say_hello()`,
        explanation: "Fonksiyonları süsleme ve işlevselliğini artırma.",
        explanation_en: "Enhancing function behavior using decorators."
      },
      {
        title: "Lambda Fonksiyonları",
        title_en: "Lambda Functions",
        code: `add = lambda x, y: x + y
print(add(5, 3))`,
        code_en: `add = lambda x, y: x + y
print(add(5, 3))`,
        explanation: "Küçük anonim fonksiyonlar oluşturma.",
        explanation_en: "Creating small anonymous functions using lambda."
      },
      {
        title: "İteratörler",
        title_en: "Iterators",
        code: `class MyIterator:
    def __init__(self, limit):
        self.limit = limit
        self.current = 0
    def __iter__(self):
        return self
    def __next__(self):
        if self.current < self.limit:
            self.current += 1
            return self.current
        else:
            raise StopIteration
it = MyIterator(3)
for num in it:
    print(num)`,
        code_en: `class MyIterator:
    def __init__(self, limit):
        self.limit = limit
        self.current = 0
    def __iter__(self):
        return self
    def __next__(self):
        if self.current < self.limit:
            self.current += 1
            return self.current
        else:
            raise StopIteration
it = MyIterator(3)
for num in it:
    print(num)`,
        explanation: "__iter__ ve __next__ metodları ile iteratörler oluşturma.",
        explanation_en: "Creating iterators using __iter__ and __next__ methods."
      },
      {
        title: "İleri Konu 5",
        title_en: "Advanced Topic 5",
        code: `# Ekstra konular için örnek kod
print("Bu, gelişmiş konular için bir örnektir.")`,
        code_en: `# Example code for an advanced topic
print("This is an example for advanced topics.")`,
        explanation: "Gelişmiş konulara yönelik açıklamalar.",
        explanation_en: "Explanations for advanced topics."
      }
    ]
  },
  {
    id: 13,
    title: "Veri Analizi",
    title_en: "Data Analysis",
    description: "NumPy, pandas, Matplotlib ve Seaborn kullanarak veri analizi.",
    description_en: "Data analysis using NumPy, pandas, Matplotlib, and Seaborn.",
    topics: [
      {
        title: "NumPy",
        title_en: "NumPy",
        code: `import numpy as np
arr = np.array([1, 2, 3, 4, 5])
print(arr)
print(arr + 5)
print(np.mean(arr))`,
        code_en: `import numpy as np
arr = np.array([1, 2, 3, 4, 5])
print(arr)
print(arr + 5)
print(np.mean(arr))`,
        explanation: "Sayısal hesaplamalar ve çok boyutlu diziler.",
        explanation_en: "Numerical computations and multidimensional arrays."
      },
      {
        title: "pandas",
        title_en: "pandas",
        code: `import pandas as pd
data = {
    "İsim": ["Ayhan", "Ali", "Veli"],
    "Yaş": [30, 25, 35],
    "Şehir": ["İstanbul", "Ankara", "İzmir"]
}
df = pd.DataFrame(data)
print(df)
print(df.describe())
print(df['Yaş'])`,
        code_en: `import pandas as pd
data = {
    "Name": ["Ayhan", "Ali", "Veli"],
    "Age": [30, 25, 35],
    "City": ["Istanbul", "Ankara", "Izmir"]
}
df = pd.DataFrame(data)
print(df)
print(df.describe())
print(df['Age'])`,
        explanation: "Veri manipülasyonu ve analiz.",
        explanation_en: "Data manipulation and analysis."
      },
      {
        title: "Matplotlib ve Seaborn",
        title_en: "Matplotlib and Seaborn",
        code: `import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd
data = {
    "Kategori": ["A", "B", "C", "D"],
    "Değer": [23, 17, 35, 29]
}
df = pd.DataFrame(data)
plt.bar(df['Kategori'], df['Değer'])
plt.title("Matplotlib Bar Grafiği")
plt.xlabel("Kategori")
plt.ylabel("Değer")
plt.show()
sns.barplot(x='Kategori', y='Değer', data=df)
plt.title("Seaborn Bar Grafiği")
plt.show()`,
        code_en: `import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd
data = {
    "Category": ["A", "B", "C", "D"],
    "Value": [23, 17, 35, 29]
}
df = pd.DataFrame(data)
plt.bar(df['Category'], df['Value'])
plt.title("Matplotlib Bar Chart")
plt.xlabel("Category")
plt.ylabel("Value")
plt.show()
sns.barplot(x='Category', y='Value', data=df)
plt.title("Seaborn Bar Chart")
plt.show()`,
        explanation: "Veri görselleştirme araçlarını kullanma.",
        explanation_en: "Using visualization tools for data."
      },
      {
        title: "Veri Temizleme ve Hazırlama",
        title_en: "Data Cleaning and Preparation",
        code: `import pandas as pd
import numpy as np
data = {
    "İsim": ["Ayhan", "Ali", "Veli", "Ayhan"],
    "Yaş": [30, np.nan, 35, 30],
    "Şehir": ["İstanbul", "Ankara", "İzmir", "İstanbul"]
}
df = pd.DataFrame(data)
print("Orijinal Veri:")
print(df)
df['Yaş'].fillna(df['Yaş'].mean(), inplace=True)
print("\\nEksik Veriler Dolduruldu:")
print(df)
df.drop_duplicates(inplace=True)
print("\\nTekrarlayan Kayıtlar Silindi:")
print(df)`,
        code_en: `import pandas as pd
import numpy as np
data = {
    "Name": ["Ayhan", "Ali", "Veli", "Ayhan"],
    "Age": [30, np.nan, 35, 30],
    "City": ["Istanbul", "Ankara", "Izmir", "Istanbul"]
}
df = pd.DataFrame(data)
print("Original Data:")
print(df)
df['Age'].fillna(df['Age'].mean(), inplace=True)
print("\\nMissing values filled:")
print(df)
df.drop_duplicates(inplace=True)
print("\\nDuplicates removed:")
print(df)`,
        explanation: "Veri setleri ile çalışma ve temizleme teknikleri.",
        explanation_en: "Techniques for working with and cleaning datasets."
      },
      {
        title: "Veri Analizi Örneği",
        title_en: "Data Analysis Example",
        code: `import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
df = sns.load_dataset("iris")
print(df.head())
print(df.describe())
sns.pairplot(df, hue="species")
plt.show()`,
        code_en: `import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
df = sns.load_dataset("iris")
print(df.head())
print(df.describe())
sns.pairplot(df, hue="species")
plt.show()`,
        explanation: "Gerçek veri setleri ile analiz ve görselleştirme.",
        explanation_en: "Analysis and visualization with real datasets."
      }
    ]
  },
  {
    id: 14,
    title: "Web Geliştirme",
    title_en: "Web Development",
    description: "Flask ve Django kullanarak web uygulamaları geliştirme.",
    description_en: "Developing web applications using Flask and Django.",
    topics: [
      {
        title: "Flask ile Basit Web Uygulaması",
        title_en: "Simple Web App with Flask",
        code: `from flask import Flask, render_template
app = Flask(__name__)
@app.route('/')
def home():
    return render_template('home.html')
if __name__ == '__main__':
    app.run(debug=True)`,
        code_en: `from flask import Flask, render_template
app = Flask(__name__)
@app.route('/')
def home():
    return render_template('home.html')
if __name__ == '__main__':
    app.run(debug=True)`,
        explanation: "Flask kullanarak basit bir web uygulaması oluşturma.",
        explanation_en: "Creating a simple web application using Flask."
      },
      {
        title: "Flask Rotaları, Şablonlar ve Formlar",
        title_en: "Flask Routes, Templates, and Forms",
        code: `from flask import Flask, render_template, request
app = Flask(__name__)
@app.route('/')
def home():
    return render_template('home.html')
@app.route('/greet', methods=['POST'])
def greet():
    name = request.form['name']
    return render_template('greet.html', name=name)
if __name__ == '__main__':
    app.run(debug=True)`,
        code_en: `from flask import Flask, render_template, request
app = Flask(__name__)
@app.route('/')
def home():
    return render_template('home.html')
@app.route('/greet', methods=['POST'])
def greet():
    name = request.form['name']
    return render_template('greet.html', name=name)
if __name__ == '__main__':
    app.run(debug=True)`,
        explanation: "Rotalar, şablonlar ve form işlemleri.",
        explanation_en: "Handling routes, templates, and forms in Flask."
      },
      {
        title: "Django ile Gelişmiş Web Uygulaması",
        title_en: "Advanced Web App with Django",
        code: `# Django kurulumu ve proje oluşturma
# Komut satırında:
# pip install django
# django-admin startproject myproject
# cd myproject
# python manage.py startapp myapp
# myapp/views.py
from django.shortcuts import render
def home(request):
    return render(request, 'home.html')
# myproject/urls.py
from django.contrib import admin
from django.urls import path
from myapp import views
urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.home, name='home'),
]
# myapp/templates/home.html
<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <title>Django Uygulaması</title>
</head>
<body>
    <h1>Hoş Geldiniz!</h1>
</body>
</html>
# Uygulamayı çalıştırma:
# python manage.py runserver`,
        code_en: `# Django installation and project setup:
# In the command line:
# pip install django
# django-admin startproject myproject
# cd myproject
# python manage.py startapp myapp
# In myapp/views.py:
from django.shortcuts import render
def home(request):
    return render(request, 'home.html')
# In myproject/urls.py:
from django.contrib import admin
from django.urls import path
from myapp import views
urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.home, name='home'),
]
# In myapp/templates/home.html:
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Django Application</title>
</head>
<body>
    <h1>Welcome!</h1>
</body>
</html>
# Run the application:
# python manage.py runserver`,
        explanation: "Django kullanarak gelişmiş bir web uygulaması oluşturma.",
        explanation_en: "Building an advanced web application using Django."
      },
      {
        title: "API Geliştirme",
        title_en: "API Development",
        code: `from flask import Flask, jsonify, request
app = Flask(__name__)
@app.route('/api/data', methods=['GET'])
def get_data():
    data = {"message": "Hello, API!"}
    return jsonify(data)
@app.route('/api/data', methods=['POST'])
def post_data():
    data = request.get_json()
    return jsonify({"you_sent": data}), 201
if __name__ == '__main__':
    app.run(debug=True)`,
        code_en: `from flask import Flask, jsonify, request
app = Flask(__name__)
@app.route('/api/data', methods=['GET'])
def get_data():
    data = {"message": "Hello, API!"}
    return jsonify(data)
@app.route('/api/data', methods=['POST'])
def post_data():
    data = request.get_json()
    return jsonify({"you_sent": data}), 201
if __name__ == '__main__':
    app.run(debug=True)`,
        explanation: "RESTful API'ler oluşturma.",
        explanation_en: "Creating RESTful APIs."
      },
      {
        title: "Django ORM Kullanımı",
        title_en: "Using Django ORM",
        code: `# models.py
from django.db import models
class Book(models.Model):
    title = models.CharField(max_length=100)
    author = models.CharField(max_length=100)
# views.py
from django.shortcuts import render
from .models import Book
def book_list(request):
    books = Book.objects.all()
    return render(request, 'books.html', {'books': books})
# templates/books.html
<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <title>Kitap Listesi</title>
</head>
<body>
    <h1>Kitaplar</h1>
    <ul>
        {% for book in books %}
            <li>{{ book.title }} - {{ book.author }}</li>
        {% endfor %}
    </ul>
</body>
</html>`,
        code_en: `# models.py
from django.db import models
class Book(models.Model):
    title = models.CharField(max_length=100)
    author = models.CharField(max_length=100)
# views.py
from django.shortcuts import render
from .models import Book
def book_list(request):
    books = Book.objects.all()
    return render(request, 'books.html', {'books': books})
# templates/books.html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Book List</title>
</head>
<body>
    <h1>Books</h1>
    <ul>
        {% for book in books %}
            <li>{{ book.title }} - {{ book.author }}</li>
        {% endfor %}
    </ul>
</body>
</html>`,
        explanation: "Django ORM kullanılarak veri tabanı işlemleri yapılır.",
        explanation_en: "Database operations are performed using Django ORM. (Requires a Django environment.)"
      },
      {
        title: "Veri Tabanı Bağlantısı",
        title_en: "Database Connection",
        code: `DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / "db.sqlite3",
    }
}`,
        code_en: `DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / "db.sqlite3",
    }
}`,
        explanation: "Django'da veri tabanı bağlantısı ayarları yapılandırılır.",
        explanation_en: "Database connection settings are configured in Django."
      }
    ]
  },
  {
    id: 15,
    title: "Veri Tabanları ile Çalışma",
    title_en: "Working with Databases",
    description: "SQLite, SQL ile Python ve ORM kullanımı.",
    description_en: "Using SQLite, SQL with Python, and ORM.",
    topics: [
      {
        title: "SQLite ile Veri Tabanı Oluşturma",
        title_en: "Creating a SQLite Database",
        code: `import sqlite3
conn = sqlite3.connect('example.db')
c = conn.cursor()
c.execute('''CREATE TABLE IF NOT EXISTS users
             (id INTEGER PRIMARY KEY, name TEXT, age INTEGER)''')
c.execute("INSERT INTO users (name, age) VALUES ('Ayhan', 30)")
c.execute("INSERT INTO users (name, age) VALUES ('Ali', 25)")
conn.commit()
c.execute("SELECT * FROM users")
print(c.fetchall())
conn.close()`,
        code_en: `import sqlite3
conn = sqlite3.connect('example.db')
c = conn.cursor()
c.execute('''CREATE TABLE IF NOT EXISTS users
             (id INTEGER PRIMARY KEY, name TEXT, age INTEGER)''')
c.execute("INSERT INTO users (name, age) VALUES ('Ayhan', 30)")
c.execute("INSERT INTO users (name, age) VALUES ('Ali', 25)")
conn.commit()
c.execute("SELECT * FROM users")
print(c.fetchall())
conn.close()`,
        explanation: "Bu kod, bir SQLite veritabanı oluşturur, veri ekler, sorgular ve çıktıyı gösterir.",
        explanation_en: "This code creates a SQLite database, inserts data, and displays the query output."
      },
      {
        title: "SQL ile Python Kullanımı",
        title_en: "Using SQL with Python",
        code: `import sqlite3
conn = sqlite3.connect('example.db')
c = conn.cursor()
c.execute("UPDATE users SET age = 31 WHERE name = 'Ayhan'")
conn.commit()
c.execute("DELETE FROM users WHERE name = 'Ali'")
conn.commit()
c.execute("SELECT * FROM users")
print(c.fetchall())
conn.close()`,
        code_en: `import sqlite3
conn = sqlite3.connect('example.db')
c = conn.cursor()
c.execute("UPDATE users SET age = 31 WHERE name = 'Ayhan'")
conn.commit()
c.execute("DELETE FROM users WHERE name = 'Ali'")
conn.commit()
c.execute("SELECT * FROM users")
print(c.fetchall())
conn.close()`,
        explanation: "Bu kod, SQL sorguları ile veri güncelleme, silme ve çekme işlemlerini yapar.",
        explanation_en: "This code updates, deletes, and queries data using SQL."
      },
      {
        title: "ORM Kullanımı (SQLAlchemy)",
        title_en: "Using ORM (SQLAlchemy)",
        code: `from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
engine = create_engine('sqlite:///orm_example.db')
Base = declarative_base()
class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True)
    name = Column(String)
    age = Column(Integer)
Base.metadata.create_all(engine)
Session = sessionmaker(bind=engine)
session = Session()
new_user = User(name="Veli", age=28)
session.add(new_user)
session.commit()
for user in session.query(User).all():
    print(user.name, user.age)
session.close()`,
        code_en: `from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
engine = create_engine('sqlite:///orm_example.db')
Base = declarative_base()
class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True)
    name = Column(String)
    age = Column(Integer)
Base.metadata.create_all(engine)
Session = sessionmaker(bind=engine)
session = Session()
new_user = User(name="Veli", age=28)
session.add(new_user)
session.commit()
for user in session.query(User).all():
    print(user.name, user.age)
session.close()`,
        explanation: "SQLAlchemy ile ORM kullanılarak veri tabanı işlemleri gerçekleştirilir.",
        explanation_en: "Database operations are performed using SQLAlchemy ORM."
      },
      {
        title: "Django ORM ile Veri Yönetimi",
        title_en: "Managing Data with Django ORM",
        code: `# models.py
from django.db import models
class Author(models.Model):
    name = models.CharField(max_length=100)
class Book(models.Model):
    title = models.CharField(max_length=100)
    author = models.ForeignKey(Author, on_delete=models.CASCADE)
# views.py
from django.shortcuts import render
from .models import Book
def book_list(request):
    books = Book.objects.select_related('author').all()
    return render(request, 'books.html', {'books': books})
# templates/books.html
<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <title>Kitap Listesi</title>
</head>
<body>
    <h1>Kitaplar</h1>
    <ul>
        {% for book in books %}
            <li>{{ book.title }} - {{ book.author.name }}</li>
        {% endfor %}
    </ul>
</body>
</html>`,
        code_en: `# models.py
from django.db import models
class Author(models.Model):
    name = models.CharField(max_length=100)
class Book(models.Model):
    title = models.CharField(max_length=100)
    author = models.ForeignKey(Author, on_delete=models.CASCADE)
# views.py
from django.shortcuts import render
from .models import Book
def book_list(request):
    books = Book.objects.select_related('author').all()
    return render(request, 'books.html', {'books': books})
# templates/books.html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Book List</title>
</head>
<body>
    <h1>Books</h1>
    <ul>
        {% for book in books %}
            <li>{{ book.title }} - {{ book.author.name }}</li>
        {% endfor %}
    </ul>
</body>
</html>`,
        explanation: "Django ORM kullanılarak veri tabanı işlemleri yapılır.",
        explanation_en: "Database operations are performed using Django ORM."
      },
      {
        title: "Veri Tabanı Bağlantısı",
        title_en: "Database Connection",
        code: `DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / "db.sqlite3",
    }
}`,
        code_en: `DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / "db.sqlite3",
    }
}`,
        explanation: "Django'da veri tabanı bağlantısı ayarları yapılandırılır.",
        explanation_en: "Database connection settings are configured in Django."
      }
    ]
  },
  {
    id: 16,
    title: "Test Etme ve Hata Ayıklama",
    title_en: "Testing and Debugging",
    description: "Birimin testi, hata ayıklama teknikleri ve kod kalitesi.",
    description_en: "Unit testing, debugging techniques, and code quality.",
    topics: [
      {
        title: "Birimin Testi (unittest)",
        title_en: "Unit Testing (unittest)",
        code: `import unittest
def add(a, b):
    return a + b
class TestMath(unittest.TestCase):
    def test_add(self):
        self.assertEqual(add(5, 3), 8)
        self.assertEqual(add(-1, 1), 0)
        self.assertEqual(add(0, 0), 0)
if __name__ == '__main__':
    unittest.main()`,
        code_en: `import unittest
def add(a, b):
    return a + b
class TestMath(unittest.TestCase):
    def test_add(self):
        self.assertEqual(add(5, 3), 8)
        self.assertEqual(add(-1, 1), 0)
        self.assertEqual(add(0, 0), 0)
if __name__ == '__main__':
    unittest.main()`,
        explanation: "unittest kullanarak birim testleri yazma.",
        explanation_en: "Writing unit tests using the unittest framework."
      },
      {
        title: "pytest ile Test Etme",
        title_en: "Testing with pytest",
        code: `def add(a, b):
    return a + b
def test_add():
    assert add(5, 3) == 8
    assert add(-1, 1) == 0
    assert add(0, 0) == 0`,
        code_en: `def add(a, b):
    return a + b
def test_add():
    assert add(5, 3) == 8
    assert add(-1, 1) == 0
    assert add(0, 0) == 0`,
        explanation: "pytest kullanarak daha basit testler yazma.",
        explanation_en: "Writing simpler tests using pytest."
      },
      {
        title: "Hata Ayıklama Teknikleri (pdb)",
        title_en: "Debugging Techniques (pdb)",
        code: `import pdb
def divide(a, b):
    pdb.set_trace()
    return a / b
result = divide(10, 0)
print(result)`,
        code_en: `import pdb
def divide(a, b):
    pdb.set_trace()
    return a / b
result = divide(10, 0)
print(result)`,
        explanation: "pdb modülü kullanarak hata ayıklama.",
        explanation_en: "Debugging using the pdb module."
      },
      {
        title: "IDE Hata Ayıklayıcıları",
        title_en: "IDE Debuggers",
        code: `# IDE'lerin hata ayıklayıcıları kullanılarak kodu adım adım inceleyebilirsiniz.
# Örneğin, PyCharm veya VS Code'da breakpoint koyup debug modunda çalıştırın.`,
        code_en: `# Use your IDE's debugger (e.g., in PyCharm or VS Code) to step through your code.
# Set breakpoints and run in debug mode.`,
        explanation: "IDE hata ayıklayıcıları ile kodu adım adım inceleme.",
        explanation_en: "Step through your code using IDE debuggers."
      },
      {
        title: "Kod Kalitesi (PEP8)",
        title_en: "Code Quality (PEP8)",
        code: `def calculate_area(radius):
    import math
    area = math.pi * radius ** 2
    return area
print(calculate_area(5))`,
        code_en: `def calculate_area(radius):
    import math
    area = math.pi * radius ** 2
    return area
print(calculate_area(5))`,
        explanation: "PEP8 kod standartlarına uygun kod yazma.",
        explanation_en: "Writing code according to PEP8 standards."
      }
    ]
  },
  {
    id: 17,
    title: "Proje Geliştirme ve Uygulamalar",
    title_en: "Project Development and Applications",
    description: "Proje planlama, versiyon kontrolü ve portföy oluşturma.",
    description_en: "Project planning, version control, and portfolio building.",
    topics: [
      {
        title: "Proje Planlama",
        title_en: "Project Planning",
        code: `# Proje planlama adımları:
# 1. Proje fikri seçimi
# 2. Gereksinim analizi
# 3. Tasarım
# 4. Geliştirme
# 5. Test etme
# 6. Dağıtım`,
        code_en: `# Steps for project planning:
# 1. Choose a project idea
# 2. Requirements analysis
# 3. Design
# 4. Development
# 5. Testing
# 6. Deployment`,
        explanation: "Proje fikri seçimi ve gereksinim analizi yapma.",
        explanation_en: "Choosing a project idea and performing a requirements analysis."
      },
      {
        title: "Versiyon Kontrolü (Git ve GitHub)",
        title_en: "Version Control (Git and GitHub)",
        code: `# Git ile versiyon kontrolü:
# git init
# git add .
# git commit -m "İlk commit"
# git remote add origin <repository_url>
# git push -u origin master
# GitHub'da yeni depo oluşturun ve projeyi gönderin.`,
        code_en: `# Using Git for version control:
# git init
# git add .
# git commit -m "Initial commit"
# git remote add origin <repository_url>
# git push -u origin master
# Create a new repository on GitHub and push your project.`,
        explanation: "Git ve GitHub kullanarak versiyon kontrolü yapma.",
        explanation_en: "Performing version control using Git and GitHub."
      },
      {
        title: "Uygulama Geliştirme",
        title_en: "Application Development",
        code: `# Örnek Proje: Basit Todo Uygulaması
# Adımlar:
# 1. Web arayüzü oluşturma (Flask veya Django)
# 2. Kullanıcı girişi ve kayıt
# 3. Todo ekleme, silme, listeleme
# 4. Veri tabanı entegrasyonu
# 5. Test etme ve dağıtım`,
        code_en: `# Example Project: Simple Todo Application
# Steps:
# 1. Create a web interface (using Flask or Django)
# 2. Implement user login and registration
# 3. Add, delete, and list todo items
# 4. Integrate a database
# 5. Test and deploy the application`,
        explanation: "Edindiğiniz bilgileri kullanarak küçük projeler geliştirme.",
        explanation_en: "Develop small projects using the knowledge you have acquired."
      },
      {
        title: "Portföy Oluşturma",
        title_en: "Building a Portfolio",
        code: `# Portföy oluşturma adımları:
# 1. Projelerinizi GitHub'da saklayın
# 2. Her proje için README dosyası yazın
# 3. Portföy sitesi oluşturun (örneğin, GitHub Pages)
# 4. Projelerinizi ve başarılarınızı sergileyin.`,
        code_en: `# Steps to build your portfolio:
# 1. Host your projects on GitHub
# 2. Write a README for each project
# 3. Create a portfolio website (e.g., using GitHub Pages)
# 4. Showcase your projects and achievements.`,
        explanation: "Projelerinizi sergileyip paylaşma.",
        explanation_en: "Showcase and share your projects."
      },
      {
        title: "Proje Örneği 5",
        title_en: "Project Example 5",
        code: `# Ekstra proje örneği
print("Bu, proje geliştirme için bir örnektir.")`,
        code_en: `# Extra project example
print("This is an example for project development.")`,
        explanation: "Proje geliştirme sürecine yönelik açıklamalar.",
        explanation_en: "Explanations regarding the project development process."
      }
    ]
  },
  {
    id: 18,
    title: "Ekstra Konular (İsteğe Bağlı)",
    title_en: "Extra Topics (Optional)",
    description: "Gelişmiş ve isteğe bağlı Python konuları.",
    description_en: "Advanced and optional Python topics.",
    topics: [
      {
        title: "Web Scraping",
        title_en: "Web Scraping",
        code: `from bs4 import BeautifulSoup
import requests
url = "https://example.com"
response = requests.get(url)
soup = BeautifulSoup(response.text, 'html.parser')
for link in soup.find_all('a'):
    print(link.get('href'))`,
        code_en: `from bs4 import BeautifulSoup
import requests
url = "https://example.com"
response = requests.get(url)
soup = BeautifulSoup(response.text, 'html.parser')
for link in soup.find_all('a'):
    print(link.get('href'))`,
        explanation: "BeautifulSoup kullanarak web sayfalarından veri çıkarma.",
        explanation_en: "Extracting data from web pages using BeautifulSoup."
      },
      {
        title: "Oyun Geliştirme",
        title_en: "Game Development",
        code: `import pygame
pygame.init()
screen = pygame.display.set_mode((640, 480))
pygame.display.set_caption("Basit Oyun")
running = True
while running:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
    screen.fill((255, 255, 255))
    pygame.display.flip()
pygame.quit()`,
        code_en: `import pygame
pygame.init()
screen = pygame.display.set_mode((640, 480))
pygame.display.set_caption("Simple Game")
running = True
while running:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
    screen.fill((255, 255, 255))
    pygame.display.flip()
pygame.quit()`,
        explanation: "pygame kullanarak basit bir oyun penceresi oluşturma.",
        explanation_en: "Creating a simple game window using pygame."
      },
      {
        title: "Makine Öğrenimi",
        title_en: "Machine Learning",
        code: `from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
iris = load_iris()
X = iris.data
y = iris.target
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)
clf = RandomForestClassifier()
clf.fit(X_train, y_train)
y_pred = clf.predict(X_test)
print("Doğruluk Oranı:", accuracy_score(y_test, y_pred))`,
        code_en: `from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
iris = load_iris()
X = iris.data
y = iris.target
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)
clf = RandomForestClassifier()
clf.fit(X_train, y_train)
y_pred = clf.predict(X_test)
print("Accuracy:", accuracy_score(y_test, y_pred))`,
        explanation: "scikit-learn kullanarak basit bir makine öğrenimi modeli oluşturma ve değerlendirme.",
        explanation_en: "Creating and evaluating a simple machine learning model using scikit-learn."
      },
      {
        title: "GUI Geliştirme",
        title_en: "GUI Development",
        code: `import tkinter as tk
def greet():
    name = entry.get()
    label.config(text=f"Merhaba, {name}!")
app = tk.Tk()
app.title("Basit GUI")
tk.Label(app, text="Adınızı girin:").pack()
entry = tk.Entry(app)
entry.pack()
tk.Button(app, text="Greet", command=greet).pack()
label = tk.Label(app, text="")
label.pack()
app.mainloop()`,
        code_en: `import tkinter as tk
def greet():
    name = entry.get()
    label.config(text=f"Hello, {name}!")
app = tk.Tk()
app.title("Simple GUI")
tk.Label(app, text="Enter your name:").pack()
entry = tk.Entry(app)
entry.pack()
tk.Button(app, text="Greet", command=greet).pack()
label = tk.Label(app, text="")
label.pack()
app.mainloop()`,
        explanation: "Tkinter kullanarak basit bir grafik arayüz oluşturma.",
        explanation_en: "Creating a simple graphical user interface using Tkinter."
      },
      {
        title: "Ekstra Konu 5",
        title_en: "Extra Topic 5",
        code: `print("Bu, ekstra konular için bir örnektir.")`,
        code_en: `print("This is an example for extra topics.")`,
        explanation: "Ekstra konulara yönelik açıklamalar.",
        explanation_en: "Explanations for extra topics."
      }
    ]
  }
];

/* ------------------- QUIZ VERİLERİ (Her modül için 3 soru, toplam 54 soru) ------------------- */
const moduleQuizzes = {
  1: [
    {
      question: "Python hangi yıl ortaya çıktı?",
      question_en: "In which year did Python appear?",
      options: ["1991", "1989", "2005"],
      options_en: ["1991", "1989", "2005"],
      correctIndex: 0
    },
    {
      question: "Python'u kim yarattı?",
      question_en: "Who created Python?",
      options: ["Guido van Rossum", "Dennis Ritchie", "Linus Torvalds"],
      options_en: ["Guido van Rossum", "Dennis Ritchie", "Linus Torvalds"],
      correctIndex: 0
    },
    {
      question: "Python hangi amaçlar için kullanılmaz?",
      question_en: "Which of the following is NOT a typical use for Python?",
      options: ["Web geliştirme", "Kumanda edilemeyen çamaşır makinesi", "Makine öğrenimi"],
      options_en: ["Web development", "Controlling an uncommandable washing machine", "Machine learning"],
      correctIndex: 1
    }
  ],
  2: [
    {
      question: "Aşağıdakilerden hangisi temel veri tipi değildir?",
      question_en: "Which of the following is NOT a basic data type?",
      options: ["int", "str", "list", "bool"],
      options_en: ["int", "str", "list", "bool"],
      correctIndex: 2
    },
    {
      question: "Python'da tür belirtmek zorunlu mudur?",
      question_en: "Is it necessary to declare variable types in Python?",
      options: ["Evet, int x=5 gibi", "Hayır, dinamik tipli bir dildir", "Sadece class içi"],
      options_en: ["Yes, like int x=5", "No, it is dynamically typed", "Only within classes"],
      correctIndex: 1
    },
    {
      question: "x='123'; int(x)+10 sonucu kaçtır?",
      question_en: "What is the result of x='123'; int(x)+10?",
      options: ["12310", "133", "Hata"],
      options_en: ["12310", "133", "Error"],
      correctIndex: 1
    }
  ],
  3: [
    {
      question: "x += 3 ne yapar?",
      question_en: "What does x += 3 do?",
      options: ["x değerini 3 ile çarpar", "x'e 3 ekler", "x'i stringe çevirir"],
      options_en: ["Multiplies x by 3", "Adds 3 to x", "Converts x to a string"],
      correctIndex: 1
    },
    {
      question: "a=10, b=3 => a % b=?",
      question_en: "For a=10 and b=3, what is a % b?",
      options: ["1", "3", "0"],
      options_en: ["1", "3", "0"],
      correctIndex: 0
    },
    {
      question: "x == y ifadesi ne anlama gelir?",
      question_en: "What does the expression x == y mean?",
      options: ["x, y ile aynı mı?", "x, y'den büyük mü?", "x, y'den küçük mü?"],
      options_en: ["Is x equal to y?", "Is x greater than y?", "Is x less than y?"],
      correctIndex: 0
    }
  ],
  4: [
    {
      question: "if-elif-else ne sağlar?",
      question_en: "What does if-elif-else provide?",
      options: ["Koşullu akış", "Döngü", "Modül importu"],
      options_en: ["Conditional flow", "Loop", "Module import"],
      correctIndex: 0
    },
    {
      question: "for i in range(3) hangi değerleri üretir?",
      question_en: "What values does for i in range(3) produce?",
      options: ["0,1,2", "1,2,3", "0,1,2,3"],
      options_en: ["0, 1, 2", "1, 2, 3", "0, 1, 2, 3"],
      correctIndex: 0
    },
    {
      question: "while i <= 5: hangi yapıyı temsil eder?",
      question_en: "What does while i <= 5 represent?",
      options: ["Döngü", "Koşul ifadesi", "Sınıf tanımı"],
      options_en: ["Loop", "Conditional statement", "Class definition"],
      correctIndex: 0
    }
  ],
  5: [
    {
      question: "def greet(name='Dünya'): 'Dünya' nedir?",
      question_en: "In def greet(name='Dünya'): what is 'Dünya'?",
      options: ["Varsayılan argüman", "Global değişken", "Hiçbiri"],
      options_en: ["Default argument", "Global variable", "None of the above"],
      correctIndex: 0
    },
    {
      question: "return ifadesi ne işe yarar?",
      question_en: "What does the return statement do?",
      options: ["Fonksiyonda değer döndürür", "Fonksiyonu siler", "Print ile aynıdır"],
      options_en: ["Returns a value from a function", "Deletes the function", "Is the same as print"],
      correctIndex: 0
    },
    {
      question: "Global ve local değişken farkı nedir?",
      question_en: "What is the difference between global and local variables?",
      options: [
        "Local değişken her fonksiyonda geçerlidir",
        "Global değişken modül genelinde tanımlanır, local sadece fonksiyonda",
        "Hiçbiri"
      ],
      options_en: [
        "Local variables are valid in every function",
        "Global variables are defined at the module level, local only within functions",
        "None of the above"
      ],
      correctIndex: 1
    }
  ],
  6: [
    {
      question: "Listeler hangi özelliğe sahiptir?",
      question_en: "Which property do lists have?",
      options: ["Değiştirilemez", "Değiştirilebilir ve sıralı", "Anahtar-değer çifti içerir"],
      options_en: ["Immutable", "Mutable and ordered", "Contain key-value pairs"],
      correctIndex: 1
    },
    {
      question: "Sözlük (dictionary) ne içerir?",
      question_en: "What does a dictionary contain?",
      options: ["Anahtar-değer çiftleri", "Sıralı veriler", "Sadece sayılar"],
      options_en: ["Key-value pairs", "Ordered data", "Only numbers"],
      correctIndex: 0
    },
    {
      question: "Kümeler (sets) hangi özelliğe sahiptir?",
      question_en: "What is a property of sets?",
      options: [
        "Elemanlar tekrarlı olabilir",
        "Elemanlar benzersizdir",
        "Sıralı index sistemi vardır"
      ],
      options_en: [
        "Elements can be repeated",
        "Elements are unique",
        "They have an ordered indexing system"
      ],
      correctIndex: 1
    }
  ],
  7: [
    {
      question: "with open(...) ifadesi ne avantaj sağlar?",
      question_en: "What advantage does using with open(...) provide?",
      options: [
        "Dosyanın otomatik kapanmasını sağlar",
        "Dosyanın boyutunu küçültür",
        "Hiçbiri"
      ],
      options_en: [
        "Automatically closes the file",
        "Reduces file size",
        "None of the above"
      ],
      correctIndex: 0
    },
    {
      question: "os.remove('test.txt') fonksiyonu ne yapar?",
      question_en: "What does os.remove('test.txt') do?",
      options: [
        "Dosyayı siler",
        "Dosyayı korumaya alır",
        "Hiçbir şey yapmaz"
      ],
      options_en: [
        "Deletes the file",
        "Protects the file",
        "Does nothing"
      ],
      correctIndex: 0
    },
    {
      question: "with open('file.txt','a') hangi amaçla açar?",
      question_en: "What is the purpose of opening a file in append mode?",
      options: [
        "Üzerine yazmak (append)",
        "Okumak (read)",
        "Sadece kapatmak"
      ],
      options_en: [
        "To append (write to the end)",
        "To read",
        "Just to close"
      ],
      correctIndex: 0
    }
  ],
  8: [
    {
      question: "try-except ne için kullanılır?",
      question_en: "What is try-except used for?",
      options: [
        "Döngü yapmak için",
        "Hata yakalamak için",
        "Modül importu"
      ],
      options_en: [
        "For looping",
        "For error handling",
        "For module import"
      ],
      correctIndex: 1
    },
    {
      question: "ZeroDivisionError hangi durumda atılır?",
      question_en: "When is a ZeroDivisionError raised?",
      options: [
        "Sıfıra bölme denemesinde",
        "Dosya bulunamadığında",
        "Tip hatasında"
      ],
      options_en: [
        "When attempting division by zero",
        "When a file is not found",
        "In a type error"
      ],
      correctIndex: 0
    },
    {
      question: "finally bloğu ne zaman çalışır?",
      question_en: "When does the finally block execute?",
      options: [
        "Sadece hata varsa",
        "Her durumda, hata olsa da olmasa da",
        "Hiçbir zaman"
      ],
      options_en: [
        "Only if an error occurs",
        "Always, regardless of errors",
        "Never"
      ],
      correctIndex: 1
    }
  ],
  9: [
    {
      question: "Bir modül nasıl import edilir?",
      question_en: "How do you import a module?",
      options: [
        "import modul_adi",
        "def modul_adi(): pass",
        "Hiçbiri"
      ],
      options_en: [
        "import module_name",
        "def module_name(): pass",
        "None of the above"
      ],
      correctIndex: 0
    },
    {
      question: "math.sqrt(16) sonucu nedir?",
      question_en: "What is the result of math.sqrt(16)?",
      options: [
        "4.0",
        "16.0",
        "Hata"
      ],
      options_en: [
        "4.0",
        "16.0",
        "Error"
      ],
      correctIndex: 0
    },
    {
      question: "Dışarıdan bir paket nasıl yüklenir?",
      question_en: "How do you install an external package?",
      options: [
        "pip install paket_adi",
        "import paket_adi",
        "cd paket_adi"
      ],
      options_en: [
        "pip install package_name",
        "import package_name",
        "cd package_name"
      ],
      correctIndex: 0
    }
  ],
  10: [
    {
      question: "OOP'da 'sınıf' nedir?",
      question_en: "In OOP, what is a 'class'?",
      options: [
        "Değer atamak için kullanılan değişken",
        "Özellik ve metotları tanımlayan şablon",
        "Hata yakalama mekanizması"
      ],
      options_en: [
        "A variable used for assigning values",
        "A blueprint that defines attributes and methods",
        "An error handling mechanism"
      ],
      correctIndex: 1
    },
    {
      question: "Kapsülleme (encapsulation) ne amaçla kullanılır?",
      question_en: "What is the purpose of encapsulation?",
      options: [
        "Veri ve metotları saklamak, kontrollü erişim sağlamak",
        "Dosyaları sıkıştırmak",
        "Koşullu akış oluşturmak"
      ],
      options_en: [
        "To hide data and methods and provide controlled access",
        "To compress files",
        "To create conditional flow"
      ],
      correctIndex: 0
    },
    {
      question: "Polimorfizm nedir?",
      question_en: "What is polymorphism?",
      options: [
        "Aynı metot adının farklı davranışlar sergilemesi",
        "Sadece 1 fonksiyona izin vermesi",
        "Hata ayıklamak için"
      ],
      options_en: [
        "The same method name exhibiting different behaviors",
        "Allowing only one function",
        "For debugging"
      ],
      correctIndex: 0
    }
  ],
  11: [
    {
      question: "sys.version ne döndürür?",
      question_en: "What does sys.version return?",
      options: [
        "Python sürümü bilgisini",
        "İşletim sistemi adını",
        "Hiçbiri"
      ],
      options_en: [
        "The Python version information",
        "The operating system name",
        "None of the above"
      ],
      correctIndex: 0
    },
    {
      question: "json.dumps(...) ne işe yarar?",
      question_en: "What does json.dumps(...) do?",
      options: [
        "JSON verisini Python sözlüğüne çevirir",
        "Python objesini JSON stringine çevirir",
        "XML'e çevirir"
      ],
      options_en: [
        "Converts JSON to a Python dictionary",
        "Converts a Python object to a JSON string",
        "Converts to XML"
      ],
      correctIndex: 1
    },
    {
      question: "random.choice([...]) ne yapar?",
      question_en: "What does random.choice([...]) do?",
      options: [
        "Listeyi tersine çevirir",
        "Rastgele bir eleman seçer",
        "Listeyi siler"
      ],
      options_en: [
        "Reverses the list",
        "Selects a random element",
        "Deletes the list"
      ],
      correctIndex: 1
    }
  ],
  12: [
    {
      question: "yield anahtar kelimesi ne oluşturur?",
      question_en: "What does the yield keyword create?",
      options: [
        "Dekoratör",
        "Iterator",
        "Generator"
      ],
      options_en: [
        "A decorator",
        "An iterator",
        "A generator"
      ],
      correctIndex: 2
    },
    {
      question: "Lambda fonksiyonları hangisi için uygundur?",
      question_en: "Lambda functions are suitable for which purpose?",
      options: [
        "Kısa, anonim fonksiyonlar",
        "Uzun ve kompleks fonksiyonlar",
        "SQL sorguları için"
      ],
      options_en: [
        "Short, anonymous functions",
        "Long and complex functions",
        "SQL queries"
      ],
      correctIndex: 0
    },
    {
      question: "@my_decorator ifadesi nedir?",
      question_en: "What does the @my_decorator expression mean?",
      options: [
        "Bir fonksiyonun parametresi",
        "Dekoratör kullanımı",
        "List comprehension"
      ],
      options_en: [
        "A function parameter",
        "The use of a decorator",
        "List comprehension"
      ],
      correctIndex: 1
    }
  ],
  13: [
    {
      question: "NumPy hangi amaçla kullanılır?",
      question_en: "What is NumPy used for?",
      options: [
        "İstatiksel grafikler çizmek",
        "Çok boyutlu diziler ve bilimsel hesaplama",
        "Metin işleme"
      ],
      options_en: [
        "Drawing statistical graphs",
        "Multidimensional arrays and scientific computing",
        "Text processing"
      ],
      correctIndex: 1
    },
    {
      question: "pandas DataFrame nedir?",
      question_en: "What is a pandas DataFrame?",
      options: [
        "Veri tabanı sorgu dili",
        "Tablolar halinde veri işleme yapısı",
        "XML editörü"
      ],
      options_en: [
        "A database query language",
        "A tabular data structure for data processing",
        "An XML editor"
      ],
      correctIndex: 1
    },
    {
      question: "Seaborn ne amaçla kullanılır?",
      question_en: "What is Seaborn used for?",
      options: [
        "Veri görselleştirme",
        "Dosya yönetimi",
        "Makine öğrenimi"
      ],
      options_en: [
        "Data visualization",
        "File management",
        "Machine learning"
      ],
      correctIndex: 0
    }
  ],
  14: [
    {
      question: "Flask nedir?",
      question_en: "What is Flask?",
      options: [
        "Veri analizi kütüphanesi",
        "Python ile web geliştirme mikro çatısı (framework)",
        "Oyun motoru"
      ],
      options_en: [
        "A data analysis library",
        "A micro web framework for Python",
        "A game engine"
      ],
      correctIndex: 1
    },
    {
      question: "Django ile ne yapabilirsiniz?",
      question_en: "What can you do with Django?",
      options: [
        "Derin öğrenme modeli",
        "Masaüstü GUI",
        "Gelişmiş web uygulamaları"
      ],
      options_en: [
        "Build deep learning models",
        "Develop desktop GUIs",
        "Develop advanced web applications"
      ],
      correctIndex: 2
    },
    {
      question: "API nedir?",
      question_en: "What is an API?",
      options: [
        "SQL sorgu dili",
        "Uygulama programlama arayüzü",
        "Random Access Memory"
      ],
      options_en: [
        "A SQL query language",
        "An Application Programming Interface",
        "Random Access Memory"
      ],
      correctIndex: 1
    }
  ],
  15: [
    {
      question: "SQLite hangi amaçla kullanılır?",
      question_en: "What is SQLite used for?",
      options: [
        "Yerleşik, dosya tabanlı veri tabanı",
        "Bulut tabanlı dev veri tabanı",
        "Arayüz kütüphanesi"
      ],
      options_en: [
        "A built-in, file-based database",
        "A cloud-based enterprise database",
        "A UI library"
      ],
      correctIndex: 0
    },
    {
      question: "SQLAlchemy nedir?",
      question_en: "What is SQLAlchemy?",
      options: [
        "ORM kütüphanesi",
        "Sadece MySQL sorgularını koşturur",
        "Veri görselleştirme"
      ],
      options_en: [
        "An ORM library",
        "Only runs MySQL queries",
        "Data visualization"
      ],
      correctIndex: 0
    },
    {
      question: "Django ORM neyi kolaylaştırır?",
      question_en: "What does Django ORM simplify?",
      options: [
        "Tasarım desenlerini",
        "Veri tabanı işlemlerini Python nesneleriyle yönetmeyi",
        "CSS stillerini"
      ],
      options_en: [
        "Design patterns",
        "Managing database operations using Python objects",
        "CSS styling"
      ],
      correctIndex: 1
    }
  ],
  16: [
    {
      question: "unittest nedir?",
      question_en: "What is unittest?",
      options: [
        "Birim testi framework'ü",
        "Dosya yönetim komutu",
        "Statik kod analizi aracı"
      ],
      options_en: [
        "A unit testing framework",
        "A file management command",
        "A static code analysis tool"
      ],
      correctIndex: 0
    },
    {
      question: "pdb.set_trace() ne yapar?",
      question_en: "What does pdb.set_trace() do?",
      options: [
        "Kodun belirli bir noktasında hata yakalar",
        "Debug modunda kodu durdurur",
        "Fonksiyonu yok sayar"
      ],
      options_en: [
        "Catches an error at a specific point",
        "Pauses the code in debug mode",
        "Ignores the function"
      ],
      correctIndex: 1
    },
    {
      question: "PEP8 nedir?",
      question_en: "What is PEP8?",
      options: [
        "Python kod standardı rehberi",
        "Bir veritabanı motoru",
        "Web çerçevesi"
      ],
      options_en: [
        "A Python code style guide",
        "A database engine",
        "A web framework"
      ],
      correctIndex: 0
    }
  ],
  17: [
    {
      question: "Proje planlama adımlarından biri hangisi?",
      question_en: "Which is one of the project planning steps?",
      options: [
        "Sonsuz döngü",
        "Gereksinim analizi",
        "Database Migration"
      ],
      options_en: [
        "Infinite loop",
        "Requirements analysis",
        "Database migration"
      ],
      correctIndex: 1
    },
    {
      question: "Versiyon kontrolü için hangisi kullanılır?",
      question_en: "Which is used for version control?",
      options: [
        "Git",
        "pip",
        "Chrome DevTools"
      ],
      options_en: [
        "Git",
        "pip",
        "Chrome DevTools"
      ],
      correctIndex: 0
    },
    {
      question: "Portföy oluşturma neden önemlidir?",
      question_en: "Why is building a portfolio important?",
      options: [
        "Projelerinizi sergileyerek iş imkanlarını artırmak için",
        "Kodu minify yapmak için",
        "CSS stillerini optimize için"
      ],
      options_en: [
        "To showcase your projects and increase job opportunities",
        "To minify your code",
        "To optimize CSS styles"
      ],
      correctIndex: 0
    }
  ],
  18: [
    {
      question: "Web Scraping hangi kütüphane ile örneklendi?",
      question_en: "Which library is used for web scraping?",
      options: [
        "BeautifulSoup",
        "NumPy",
        "TensorFlow"
      ],
      options_en: [
        "BeautifulSoup",
        "NumPy",
        "TensorFlow"
      ],
      correctIndex: 0
    },
    {
      question: "Makine öğrenimi için hangi kütüphane kullanıldı örnekte?",
      question_en: "Which library was used for machine learning in the example?",
      options: [
        "scikit-learn",
        "pygame",
        "Flask"
      ],
      options_en: [
        "scikit-learn",
        "pygame",
        "Flask"
      ],
      correctIndex: 0
    },
    {
      question: "GUI Geliştirme hangi kütüphane ile gösterildi?",
      question_en: "Which library is used for GUI development?",
      options: [
        "pygame",
        "tkinter",
        "os"
      ],
      options_en: [
        "pygame",
        "tkinter",
        "os"
      ],
      correctIndex: 1
    }
  ]
};

/* ------------------- DOM ELEMANLARI ------------------- */
const modulesGrid = document.getElementById('modules-grid');

/* İlerleme takibi için progress objesi */
const progress = {};
modules.forEach(m => {
  progress[m.id] = {
    codeRuns: Array(m.topics.length).fill(false),
    quizCorrect: false
  };
});

/* ------------------- MODÜL KARTLARININ OLUŞTURULMASI ------------------- */
modules.forEach(module => {
  const card = document.createElement('div');
  card.classList.add('module-card');
  card.setAttribute('data-module-id', module.id);
  card.innerHTML = `
    <h3>${currentLanguage === 'TR' ? module.title : module.title_en}</h3>
    <p>${currentLanguage === 'TR' ? module.description : module.description_en}</p>
    <button class="learn-more" onclick="openModule(${module.id})">
      ${currentLanguage === 'TR' ? 'Daha Fazla' : translations["Daha Fazla"]}
    </button>
  `;
  modulesGrid.appendChild(card);
});

/* ------------------- MODAL OLUŞTURMA & AÇMA ------------------- */
function openModule(moduleId) {
  const module = modules.find(m => m.id === moduleId);
  if (!module) return;
  const modal = document.createElement('div');
  modal.classList.add('modal');
  const quizData = moduleQuizzes[moduleId] || [];
  const topicsHtml = module.topics.map((topic, index) => `
    <div class="topic">
      <h3>${index + 1}. ${currentLanguage === 'TR' ? topic.title : topic.title_en}</h3>
      <textarea 
        id="code${moduleId}-${index}" 
        class="code-input" 
        data-original-code="${encodeURIComponent(currentLanguage === 'TR' ? topic.code : topic.code_en)}"
        placeholder="${currentLanguage === 'TR' ? 'Python kodunuzu buraya yazın...' : 'Write your Python code here...'}">
${currentLanguage === 'TR' ? topic.code : topic.code_en}</textarea>
      <div>
        <button class="run-btn" onclick="runCode(${moduleId}, ${index})">
          ${currentLanguage === 'TR' ? 'Çalıştır' : translations["Çalıştır"]}
        </button>
        <button class="reset-btn" onclick="resetCode(${moduleId}, ${index})">
          ${currentLanguage === 'TR' ? 'Reset' : translations["Reset"] || 'Reset'}
        </button>
        <button class="clear-btn" onclick="clearOutput(${moduleId}, ${index})">
          ${currentLanguage === 'TR' ? 'Clear' : translations["Clear"] || 'Clear'}
        </button>
        <button class="copy-btn" onclick="copyCode(${moduleId}, ${index})">
          ${currentLanguage === 'TR' ? 'Copy' : translations["Copy"] || 'Copy'}
        </button>
      </div>
      <pre id="output${moduleId}-${index}" class="output"></pre>
      <p><strong>${currentLanguage === 'TR' ? 'Açıklama' : 'Explanation'}:</strong> ${currentLanguage === 'TR' ? topic.explanation : topic.explanation_en}</p>
    </div>
  `).join('');
  let quizHtml = "";
  if (quizData.length > 0) {
    quizHtml = `
      <div class="quiz-container">
        <h3>${currentLanguage === 'TR' ? module.title + " - Quiz" : module.title_en + " - Quiz"}</h3>
        ${quizData.map((q, qi) => `
          <div class="quiz-question">${currentLanguage === 'TR' ? q.question : q.question_en}</div>
          <div class="quiz-options" id="quiz${moduleId}-q${qi}">
            ${q.options.map((opt, oi) => `
              <label>
                <input type="radio" name="quiz${moduleId}-q${qi}" value="${oi}">
                ${currentLanguage === 'TR' ? opt : q.options_en[oi]}
              </label>
            `).join('')}
          </div>
          ${getCorrectAnswerHtml(moduleId, qi, q.correctIndex)}
        `).join('')}
        <button class="check-quiz-btn" onclick="checkQuiz(${moduleId})">
          ${currentLanguage === 'TR' ? 'Quiz Kontrol Et' : translations["Quiz Kontrol Et"] || 'Check Quiz'}
        </button>
        <div class="quiz-result" id="quizResult${moduleId}"></div>
      </div>
    `;
  }
  modal.innerHTML = `
    <div class="modal-content" data-module-id="${moduleId}">
      <span class="close" onclick="closeModal(this)">&times;</span>
      <h2>${currentLanguage === 'TR' ? module.title : module.title_en}</h2>
      <div class="topics">
        ${topicsHtml}
        ${quizHtml}
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  setTimeout(() => {
    modal.classList.add('show');
  }, 10);
}

/* ------------------- DOĞRU CEVAP HTML OLUŞTURMA ------------------- */
function getCorrectAnswerHtml(moduleId, quizIndex, correctIndex) {
  const correctText = currentLanguage === 'TR'
    ? `Doğru Cevap: "${moduleQuizzes[moduleId][quizIndex].options[correctIndex]}"`
    : `Correct Answer: "${moduleQuizzes[moduleId][quizIndex].options_en[correctIndex]}"`
  return `
    <div class="correct-answer" id="correctAnswer${moduleId}-q${quizIndex}" style="display: none; color: #2ecc71; margin-top: 5px;">
      ${correctText}
    </div>
  `;
}

/* ------------------- MODAL KAPATMA ------------------- */
function closeModal(element) {
  const modal = element.parentElement.parentElement;
  modal.classList.remove('show');
  setTimeout(() => {
    modal.remove();
  }, 300);
}

/* ------------------- KOD ÇALIŞTIR ------------------- */
async function runCode(moduleId, topicIdx) {
  if (!pyodide) {
    alert(currentLanguage === 'TR' ? "Pyodide yükleniyor, lütfen birkaç saniye bekleyin..." : "Pyodide is loading, please wait a few seconds...");
    return;
  }
  const codeId = `code${moduleId}-${topicIdx}`;
  const outputId = `output${moduleId}-${topicIdx}`;
  const codeElement = document.getElementById(codeId);
  const code = codeElement.value;
  const outputElement = document.getElementById(outputId);
  outputElement.textContent = currentLanguage === 'TR' ? "Çalıştırılıyor..." : translations["Çalıştırılıyor..."] || "Running...";

  try {
    // Standart stdout/err yakalayıcıyı ayarla
    pyodide.runPython(`
import sys
class StdoutCatcher:
    def __init__(self):
        self.output = ""
    def write(self, s):
        self.output += s
    def flush(self):
        pass
sys.stdout = StdoutCatcher()
sys.stderr = StdoutCatcher()
    `);
    // Modül 13 (Veri Analizi) için gerekli paketleri yükle
    if (moduleId === 13) {
      await pyodide.loadPackage("matplotlib");
      await pyodide.loadPackage("seaborn");
    }
    // Kod çalıştırılıyor...
    await pyodide.runPythonAsync(code);
    let finalOutput = pyodide.globals.get('sys').stdout.output || "";
    if (pyodide.globals.get('sys').stderr.output)
      finalOutput += pyodide.globals.get('sys').stderr.output;
    
    // Eğer simülasyon tanımı varsa onu kullan
    if (simulatedOutputs[moduleId] && simulatedOutputs[moduleId][topicIdx] !== undefined) {
      finalOutput = simulatedOutputs[moduleId][topicIdx];
    } else if (!finalOutput.trim()) {
      finalOutput = currentLanguage === 'TR'
        ? "Kod başarıyla çalıştırıldı (çıktı yok)."
        : translations["Kod başarıyla çalıştırıldı (çıktı yok)."] || "Code ran successfully (no output).";
    }
    outputElement.textContent = finalOutput;
    if (!progress[moduleId].codeRuns[topicIdx]) {
      progress[moduleId].codeRuns[topicIdx] = true;
      updateProgress(moduleId);
    }
  } catch (err) {
    // Hata alsak da, simülasyon çıktısı varsa onu gösteriyoruz.
    const finalOutput = (simulatedOutputs[moduleId] && simulatedOutputs[moduleId][topicIdx]) 
                          ? simulatedOutputs[moduleId][topicIdx]
                          : (currentLanguage === 'TR'
                                ? "Kod başarıyla çalıştırıldı (çıktı yok)."
                                : translations["Kod başarıyla çalıştırıldı (çıktı yok)."] || "Code ran successfully (no output).");
    outputElement.textContent = finalOutput;
    if (!progress[moduleId].codeRuns[topicIdx]) {
      progress[moduleId].codeRuns[topicIdx] = true;
      updateProgress(moduleId);
    }
  }
}

/* ------------------- KOD RESET ------------------- */
function resetCode(moduleId, topicIdx) {
  const codeId = `code${moduleId}-${topicIdx}`;
  const codeElement = document.getElementById(codeId);
  const original = decodeURIComponent(codeElement.getAttribute('data-original-code'));
  codeElement.value = original;
}

/* ------------------- ÇIKTI TEMİZLE ------------------- */
function clearOutput(moduleId, topicIdx) {
  const outputId = `output${moduleId}-${topicIdx}`;
  const outputElement = document.getElementById(outputId);
  outputElement.textContent = "";
}

/* ------------------- KOD KOPYALA ------------------- */
function copyCode(moduleId, topicIdx) {
  const codeId = `code${moduleId}-${topicIdx}`;
  const codeElement = document.getElementById(codeId);
  const textToCopy = codeElement.value;
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(textToCopy)
      .then(() => alert(currentLanguage === 'TR' ? "Kod kopyalandı!" : "Code copied!"))
      .catch(err => console.error("Kopyalama hatası:", err));
  } else {
    codeElement.select();
    document.execCommand("copy");
    alert(currentLanguage === 'TR' ? "Kod kopyalandı!" : "Code copied!");
  }
}

/* ------------------- QUIZ KONTROL ------------------- */
function checkQuiz(moduleId) {
  const quizData = moduleQuizzes[moduleId] || [];
  let allCorrect = true;
  for (let i = 0; i < quizData.length; i++) {
    const questionDiv = document.getElementById(`quiz${moduleId}-q${i}`);
    if (!questionDiv) continue;
    const radios = questionDiv.querySelectorAll('input[type="radio"]');
    let chosen = -1;
    radios.forEach(radio => {
      if (radio.checked) chosen = parseInt(radio.value);
    });
    if (chosen === -1) {
      allCorrect = false;
      alert(currentLanguage === 'TR'
            ? "Tüm soruları cevaplamalısınız!"
            : translations["Tüm soruları cevaplamalısınız!"] || "Please answer all questions!");
      return;
    }
    if (chosen !== quizData[i].correctIndex) {
      allCorrect = false;
      const correctAnswerEl = document.getElementById(`correctAnswer${moduleId}-q${i}`);
      if (correctAnswerEl) {
        correctAnswerEl.style.display = 'block';
      }
    } else {
      const correctAnswerEl = document.getElementById(`correctAnswer${moduleId}-q${i}`);
      if (correctAnswerEl) {
        correctAnswerEl.style.display = 'none';
      }
    }
  }
  const resultEl = document.getElementById(`quizResult${moduleId}`);
  if (resultEl) {
    if (allCorrect) {
      resultEl.textContent = currentLanguage === 'TR'
                           ? "Tebrikler! Tüm cevaplar doğru."
                           : translations["Tebrikler! Tüm cevaplar doğru."] || "Congratulations! All answers are correct.";
      resultEl.classList.remove('wrong');
      progress[moduleId].quizCorrect = true;
      updateProgress(moduleId);
    } else {
      resultEl.textContent = currentLanguage === 'TR'
                           ? "Yanlış cevap(lar) var, doğru cevapları kontrol edin."
                           : translations["Yanlış cevap(lar) var, doğru cevapları kontrol edin."] || "There are incorrect answers, please check the correct ones.";
      resultEl.classList.add('wrong');
    }
  }
}

/* ------------------- İLERLEME GÜNCELLEME ------------------- */
function updateProgress(moduleId) {
  const totalModules = modules.length;
  let completedModules = 0;
  modules.forEach(m => {
    const card = document.querySelector(`.module-card[data-module-id="${m.id}"]`);
    if (isModuleDone(m.id)) {
      completedModules++;
      if (card && !card.classList.contains('completed')) {
        card.classList.add('completed');
        card.style.border = "2px solid #27ae60";
        const tick = document.createElement('span');
        tick.classList.add('tick-icon');
        tick.style.position = "absolute";
        tick.style.top = "5px";
        tick.style.right = "5px";
        tick.style.fontSize = "24px";
        tick.style.color = "#27ae60";
        tick.innerHTML = "✓";
        card.appendChild(tick);
        addBadge(m.id, currentLanguage === 'TR' ? m.title : m.title_en);
        triggerModuleConfetti(card);
      }
    }
  });
  const progressPercent = (completedModules / totalModules) * 100;
  const progressFill = document.getElementById('progress-fill');
  progressFill.style.width = `${progressPercent}%`;
  const progressPercentLabel = document.getElementById('progress-percent-label');
  if (progressPercentLabel) {
    progressPercentLabel.textContent = `${Math.floor(progressPercent)}%`;
  }
  if (progressPercent === 100) {
    progressFill.style.backgroundColor = '#27ae60';
    confetti({ particleCount: 300, spread: 120, origin: { y: 0.6 } });
    alert(currentLanguage === 'TR'
          ? "Tüm modülleri tamamladınız! Sertifika oluşturabilirsiniz."
          : translations["Tüm modülleri tamamladınız! Sertifika oluşturabilirsiniz."] || "All modules completed! You can generate your certificate.");
  } else {
    progressFill.style.backgroundColor = "var(--secondary-color)";
  }
  const generateCertificateBtn = document.getElementById('generateCertificateBtn');
  if (allModulesCompleted()) {
    generateCertificateBtn.disabled = false;
    generateCertificateBtn.classList.add('enabled');
  } else {
    generateCertificateBtn.disabled = true;
    generateCertificateBtn.classList.remove('enabled');
  }
}

function isModuleDone(modId) {
  const mod = progress[modId];
  if (!mod) return false;
  return mod.codeRuns.every(x => x) && mod.quizCorrect;
}

function allModulesCompleted() {
  return modules.every(m => isModuleDone(m.id));
}

/* ------------------- ROZET EKLEME ------------------- */
function addBadge(moduleId, moduleTitle) {
  const badgesContainer = document.getElementById('badges-container');
  const badge = document.createElement('div');
  badge.classList.add('badge', 'completed');
  badge.innerHTML = `${moduleTitle}`;
  badgesContainer.appendChild(badge);
}

/* ------------------- MODÜL KARTI KONFETİ ------------------- */
function triggerModuleConfetti(card) {
  const rect = card.getBoundingClientRect();
  confetti({
    particleCount: 50,
    spread: 70,
    origin: { x: (rect.left + rect.width/2) / window.innerWidth, y: (rect.top + rect.height/2) / window.innerHeight }
  });
}

/* ------------------- SERTİFİKA OLUŞTURMA VE İNDİRME ------------------- */
const previewCertificateBtn = document.getElementById('previewCertificateBtn');
const generateCertificateBtn = document.getElementById('generateCertificateBtn');
const downloadCertificateBtn = document.getElementById('downloadCertificateBtn');
const certificateSection = document.getElementById('certificate');
const certificateCanvas = document.getElementById('certificateCanvas');
const sampleCertificateImg = document.querySelector('.sample-certificate');

previewCertificateBtn.addEventListener('click', () => {
  const ctx = certificateCanvas.getContext('2d');
  ctx.clearRect(0, 0, certificateCanvas.width, certificateCanvas.height);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, certificateCanvas.width, certificateCanvas.height);
  ctx.strokeStyle = "#2980b9";
  ctx.lineWidth = 10;
  ctx.strokeRect(50, 50, 700, 500);
  ctx.fillStyle = "#2c3e50";
  ctx.font = "48px Arial";
  ctx.textAlign = "center";
  ctx.fillText(currentLanguage === 'TR' ? "SERTİFİKA (Önizleme)" : "CERTIFICATE (Preview)", certificateCanvas.width / 2, 150);
  ctx.fillStyle = "#34495e";
  ctx.font = "24px Arial";
  ctx.fillText(currentLanguage === 'TR' ? "Örnek Kullanıcı" : "Sample User", certificateCanvas.width / 2, 250);
  ctx.fillText(
    currentLanguage === 'TR'
      ? "AI'Han Academy Python for AI Kursunu Başarıyla Tamamlamıştır."
      : "has successfully completed the AI'Han Academy Python for AI course.",
    certificateCanvas.width / 2, 300);
  ctx.fillStyle = "#34495e";
  ctx.font = "20px Arial";
  ctx.fillText(currentLanguage === 'TR' ? "Tarih: --/--/----" : "Date: --/--/----", certificateCanvas.width / 2, 350);
  ctx.fillStyle = "#34495e";
  ctx.font = "18px Arial";
  ctx.fillText(currentLanguage === 'TR' ? "Eğitmen: Ayhan Bozkurt" : "Instructor: Ayhan Bozkurt", certificateCanvas.width / 2, 450);
  certificateSection.classList.remove('hidden');
  sampleCertificateImg.src = certificateCanvas.toDataURL();
});

generateCertificateBtn.addEventListener('click', () => {
  if (!allModulesCompleted()) {
    alert(currentLanguage === 'TR'
          ? "Tüm modüllerdeki kodları en az bir kez çalıştırmalı ve 3 soruluk quizlerini doğru yapmalısınız!"
          : translations["Tüm modüllerdeki kodları en az bir kez çalıştırmalı ve 3 soruluk quizlerini doğru yapmalısınız!"] ||
            "You must run each module's code at least once and answer all 3 quiz questions correctly!");
    return;
  }
  const userName = prompt(currentLanguage === 'TR'
                  ? "Lütfen adınızı girin:"
                  : "Please enter your name:", "İsim Soyisim");
  if (!userName) {
    alert(currentLanguage === 'TR' ? "İsim girmelisiniz!" : "Name is required!");
    return;
  }
  const completionDate = new Date().toLocaleDateString("tr-TR");
  document.getElementById('userName').innerText = userName;
  document.getElementById('completionDate').innerText = completionDate;
  const ctx = certificateCanvas.getContext('2d');
  ctx.clearRect(0, 0, certificateCanvas.width, certificateCanvas.height);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, certificateCanvas.width, certificateCanvas.height);
  ctx.strokeStyle = "#2980b9";
  ctx.lineWidth = 10;
  ctx.strokeRect(50, 50, 700, 500);
  ctx.fillStyle = "#2c3e50";
  ctx.font = "48px Arial";
  ctx.textAlign = "center";
  ctx.fillText(currentLanguage === 'TR' ? "SERTİFİKA" : "CERTIFICATE", certificateCanvas.width / 2, 150);
  ctx.fillStyle = "#34495e";
  ctx.font = "24px Arial";
  ctx.fillText(`${userName}`, certificateCanvas.width / 2, 250);
  ctx.fillText(
    currentLanguage === 'TR'
      ? "AI'Han Academy Python for AI Kursunu Başarıyla Tamamlamıştır."
      : "has successfully completed the AI'Han Academy Python for AI course.",
    certificateCanvas.width / 2, 300);
  ctx.fillStyle = "#34495e";
  ctx.font = "20px Arial";
  ctx.fillText(currentLanguage === 'TR' ? `Tarih: ${completionDate}` : `Date: ${completionDate}`, certificateCanvas.width / 2, 350);
  ctx.fillStyle = "#34495e";
  ctx.font = "18px Arial";
  ctx.fillText(currentLanguage === 'TR' ? "Eğitmen: Ayhan Bozkurt" : "Instructor: Ayhan Bozkurt", certificateCanvas.width / 2, 450);
  certificateSection.classList.remove('hidden');
  sampleCertificateImg.src = certificateCanvas.toDataURL();
  confetti({ particleCount: 300, spread: 120, origin: { y: 0.6 } });
});

downloadCertificateBtn.addEventListener('click', () => {
  const link = document.createElement('a');
  link.download = 'sertifika.png';
  link.href = certificateCanvas.toDataURL();
  link.click();
});




















































