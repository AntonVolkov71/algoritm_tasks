### Система управления базами данных

- СУБД - database management system (DBMS)
- создать базу или таблицу
- внести новые или удалить старые данные
- выгрузить информацию по условию
- безопасность доступа к данным

### SQL

- structured Query Language
- управление реляционными БД
- декларативный

#### Операторы SQL

- не чувствителен к регистру, но лучше использовать ЗАГЛАВНЫЕ, чтобы разделять операторы
- SELECT - 'выбрать', что выгрузить из базы
    - можно все *
    - можно определенные поля SELECT id, name FROM documentation
        - порядок важен, какой порядок такая и выгрузка
- FROM - 'из', откуда выгрузить данные
- ; - конец запроса
- -- - комментарий строчный
- /* */ - многострочный комментарий

```
    SELECT * FROM documentation; // выгрузка всех строк из таблицы documentation
```

- LIMIT - ограничение кол-ва строк, выгрузка сначала и далее
- при описании полей после оператора лучше переносить на новую строку, читабельнее

```
    SELECT id,
		   path_dir
    FROM documentation 
    LIMIT 2; // выгрузка двух строк
```

- CAST - приведение к типу, вместе с оператором AS
    - SELECT CAST(id AS VARCHAR), суть CAST(invoice_date AS date)
- EXTRACT - извлечь часть данных
    - EXTRACT(YEAR FROM CAST(invoice_date AS date))

### Типы данных в PostgreSQL

- числовые типы
    - integer (int, либо int4) - от −2147483648 до +2147483647
    - real - вещественные числа
- символьные типы
    - character ( char(n), где n - длина текста )- текст фиксированной длины
    - character varying ( varchar(n), где n - лимит длины ) - тек нефиксированной длины
    - text - строка любой длины (в стандарте SQL нет), используется в PostgreSQL
- дата и время
    - timestamp - дата и время, обычно в ISO 'YYYY-MM-DD'
        - в PostgreSQL два типа:
            - timestamp with time zone
            - timestamp without time zone (по умолчанию)
    - date - входит только дата в любом формате
    - interval - период времени
- логические boolean - TRUE FALSE

### Диаграмма БД

- ER-диаграмма (entity-relationship diagram - сущность-связь)
    - отношения таблиц в БД
- primary key - первичный ключ в таблице
- foreign key - внешний ключ, поле из другой таблицы

### Where оператор сравнения

- = - равенство
- <> - неравенство (!= в PostgreSQL тоже работает)
- > , <, >=, <= - больше меньше и так далее
    - сравнение с чисел без кавычек
    - сравнение символьных в одинарных кавычках

```
    SELECT id,
            path_dir
    FROM documentation
    WHERE path_dir = 'PATH_DIR2';
```

- BETWEEN $1 AND $2 - значение между двумя границами

```
    SELECT id,
            path_dir
    FROM documentation
    WHERE id BETWEEN 2 AND 3;
```

- LIKE - частичное совпадение
    - может содержать
    - % - любое количество символов, включая ноль символов
        - WHERE path_dir LIKE 'PATH%';
    - _ - равно одному символу
        - WHERE path_dir LIKE '_ATH%';
- AND, OR, NOT - объединение нескольких условий
    - можно комбинировать OR (age > 43 AND city = 'Тула')

```
    SELECT *
    FROM documentation 
    WHERE id >= 2 
          OR path_dir LIKE '_ATH&';
```

- IN - вхождение в список
    - WHERE path_dir IN ('PATH_DIR', 'PATH_DIR2')

#### Специальное значение NULL

- отсутствие данных
- нельзя сравнить =, >, <, LIKE

```
    SELECT *
    FROM client
    WHERE fax = NULL; // пустая таблица
```

- IS NULL, IS NOT NULL - для работы с NULL
    - WHERE path_dir IS NOT NULL

### Математические операции

- '+ - * /' - стандартные
- строки складывать нельзя!!!

```
  SELECT invoice_line_id,
       invoice_id,
       invoice_line_id + invoice_id
  FROM invoice_line
  LIMIT 5; 
  // будет сумма в столбце invoice_line_id + invoice_id
```

### Агрегирующие функции

- подсчет общего количества строк, суммы, среднего, максимума и минимума
- SUM(поле) - сумма значений в поле
- AVG(поле) - среднее арифметическое значений в поле
- MIN(поле) - минимальное значение в поле
- MAX(поле) - максимальное значение в поле
- COUNT(*) - количество записей в таблице (количество строк)
- COUNT(поле) - количество записей в столбце (количество строк)
- DISTINCT(поле) - количество уникальных значений

```
  SELECT SUM(id)
  FROM documentation;
  // столбец sum с суммой всех id
  
  SELECT COUNT(*)
  FROM documentation;
  // количетсво всех строк, результат столбец sum
  
  SELECT DISTINCT(path_dir)
  FROM documentation;
  // вернет только уникальные значения
```

### Группировка данных

- GROUP BY - группирует по значениям, всегда после WHERE, если WHERE нет тогда GROUP BY $$ FROM
- отличие от DISTINCT, непросто выведет уникальные, но составить сводную таблицу, добавим агрегирующие данные

```
  SELECT path_dir, AVG(id)
  FROM documentation
  GROUP BY path_dir;
  
  // столбец path_dir уникальных значений, и столбец avg среднее значений по этим значениям поля id
```

- группировка по нескольким полям

```
  GROUP BY CAST(invoice_date AS date), 
         billing_country 
```

### Сортировка данных

- ORDER BY - по умолчанию от меньшего к большему
    - DESC - нисходящий, убывающий (по убыванию)
    - ASC - восходящий (во возрастанию)
- можно совместно использовать LIMIT

```
  SELECT path_dir, AVG(id)
  FROM documentation
  GROUP BY path_dir
  ORDER BY AVG(id) DESC;
```

- сортировка по нескольким полям, важен порядок полей
- можно сортировать строки!!

```
  ORDER BY billing_country, // сначала по этому полю
           customer_id,     // потом по следующим
           total DESC; 
```

- > Важный принцип сортировки по нескольким полям — порядок полей,
  > которые указывают после оператора ORDER BY, влияет на иерархию сортировки таблицы.
  > С группировкой всё проще — порядок полей на группы не влияет.

### Оператор HAVING

- если нужно выбрать например SUM(total) и оставить только те которые меньше 40
- здесь WHERE не поможет, WHERE SUM(total) > 40 - НЕ СРАБОТАЕТ
- используют, чтобы получить срез данных после группировки
- НЕЛЬЗЯ применять без GROUP BY, но можно после него
- можно использовать агрегирующий функции (AVG(), SUM() и т.д.)
- в SELECT и HAVING должны присутствовать одинаковые агрегирующие функции
- если в SELECT не будет, а в HAVING будет, не выполниться
- при HAVING наличие WHERE не нужно

```
  SELECT customer_id,
         SUM(total)
  FROM invoice
  GROUP BY customer_id
  HAVING SUM(total) > 41
  ORDER BY SUM(total) DESC;
```

### Создание таблиц

- CREATE TABLE - создание таблицы
- можно задавать ограничения столбцов
- можно задавать значение по умолчанию
- id INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY - лучше полностью!!

```
CREATE TABLE films (
    id INTEGER GENERATED BY DEFAULT AS IDENTITY,
    title varchar(40) NOT NULL,
    produced integer NOT NULL,
    date_prod date,
    kind varchar(10),
    len_min integer,
    CONSTRAINT films_pk PRIMARY KEY (id),
    CONSTRAINT constr_example CHECK (len_min > 100 AND title <> '')
);

CREATE TABLE users (
    id INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    name varchar(40) DEFAULT 'unknown'
);
```

#### Вторичные ключи

- делают с помощью ограничения внешнего ключа
- значения столбца должны соответствовать значениям в некоторой строке другой таблицы
- это Ссылочная целостность двух связанных таблиц - Referential integrity
- такие ограничения - ограничением ссылочной целостности - Referential integrity constraint
- ON DELETE RESTRICT - запретить удаление записи, на которую есть ссылка
- ON DELETE CASCADE - удалить все связанные данные

```
CREATE TABLE favorite_films (
    id INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    user_id INTEGER REFERENCES users (id) ON DELETE RESTRICT,
    film_id INTEGER REFERENCES films (id) ON DELETE CASCADE
); 
```

### Удаление таблиц

- DROP TABLE - просто удаление если нет связанных таблиц
- DROP TABLE $$ CASCADE - удаление
- DROP TABLE IF EXISTS users - удаление если таблица существует

### Изменение таблиц

- вместо удаления и создания новой с новым типом поля например
- ALTER TABLE - можно добавлять, удалять столбцы и ограничения, изменять значения по умолчанию и типы, и переименовывать
- ADD COLUMN - добавить столбец, по умолчанию заполниться NULL
- можно добавить значения в новом столбце

```
ALTER TABLE films ADD COLUMN new_column integer;

// добавить new_column при условии что поле path_dir НЕ ПУСТОЕ
ALTER TABLE documentation ADD COLUMN new_column text CHECK (path_dir <> '')
```

- DROP COLUMN - удаление столбца, не забываем про связи

```
ALTER TABLE products DROP COLUMN description;

ALTER TABLE products DROP COLUMN description CASCADE;
```

- ALTER COLUMN - изменить столбец

```
ALTER TABLE products ADD CHECK (name <> 'что-то странное');

//имя товара должно быть уникальным
ALTER TABLE products ADD CONSTRAINT uq_products_name UNIQUE (name);

//поле some_id должно быть внешним ключом к таблице another_table
ALTER TABLE example ADD CONSTRAINT fk_example_to_another_table FOREIGN KEY (some_id) REFERENCES another_table;

//теперь категория должна быть указана (не равна NULL)
ALTER TABLE products ALTER COLUMN category SET NOT NULL;
```

- установить столбцу новое значение по умолчанию

```
// создание с значением по умолчанию
ALTER TABLE documentation ADD COLUMN new_column integer DEFAULT 100;

// изменение по умолчанию для следующих
ALTER TABLE products ALTER COLUMN price SET DEFAULT 200;

// изменить в существующем столбве
ALTER TABLE documentation ALTER COLUMN new_column DROP DEFAULT;

// не выполниться если существующие значения другого типа
ALTER TABLE products ALTER COLUMN price TYPE numeric(10,2);
```

### Добавление данных

- INSERT - вставка, можно не указывать названия столбцов

```
// clients целевая таблица
// (name, phone, email) названия столбоц
INSERT INTO clients (name, phone, email)
VALUES ( 'Кое-кто', '80932334444', 'koe_kto@mail.ru');
```

- вставка если существует тогда обновиться

```
INSERT INTO clients (id, name, phone, email)
VALUES (9, 'Анна Васильевна Орешкина', '805565423422', 'anna@mail.com')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, phone = EXCLUDED.phone, email = EXCLUDED.email;
```

- вставка по из выборки из другой таблицы с условием

```
INSERT INTO old_orders(id, client_id, date, status, address)
SELECT id, client_id, date, status, address
FROM orders
WHERE date > '2020-01-01';
```

### Обновление данных

- UPDATE - обновление данных, обязательно допустимый тип
- также можно использовать WHERE и SELECT(выборка данных из других таблиц)

```
UPDATE clients SET phone = 12321312312 WHERE name = 'Кое-кто';

UPDATE positions
SET amount = amount + 1
WHERE order_id IN (
  SELECT id
  FROM orders
  WHERE orders.client_id = (SELECT id FROM clients WHERE name = 'Бук Василий Петрович')
);
```

### Удаление данных

- DELETE - удаление данных

```
DELETE FROM clients WHERE id = 1;
```

### Связи между таблицами

- первичный ключ - уникальный признак записи
- внешний ключ - поле, которое отсылает к первичному ключу другой таблицы

#### Связь один к одному - one-to-one

- одна запись к одной записи к одной записи другой таблицы
- редкость, ибо можно использовать одну таблицу

#### Связь один ко многим - one-to-many

- одна запись одной таблицы соответствует к нескольким записям другой таблицы

#### Связь многие ко многим - many-to-many

- к нескольким записям соответствуют несколько записей другой
- не очень удобная, и можно запутаться

### ER-диаграммы

- один к одному - просто линия
- один ко многим - с одной стороны "типа конец стрелки" с другой ничего
- многие ко многим - с одной стороны "типа конец стрелки" с другой тоже "типа конца"

### Псевдонимы

- временное название, которое присваивается в запросе таблице или полю
- в самой БД оригинальные названия не меняются
- особенно используется для SUM, AVG и т.д.
- к псевдонимам нельзя обращаться из WHERE и HAVING

```
SELECT AVG(id) as my_adg FROM clients;
SELECT name AS other_name FROM clients;

// выведет столбец other_name
// дальше в запросе можно испоьзовать уже псевдоним 
GROUP BY other_name

```

### Типы объединения таблиц

- INNER JOIN - внутреннее объединение общее для двух таблиц
    - есть две таблицы заказы с id покупателя и покупатели, ID есть там и там
    - если берем таблицу покупателей и INNER JOIN с таблицей заказов
    - в результате будут только те покупатели, которые id есть в заказах
    - и получится только покупатели, которые делали заказ, строка заполниться так как покупатель есть в заказах
- LEFT OUTER JOIN - левое внешнее объединение, в результат слияния войдут все записи из левой таблицы,
    - записи из правой только в том случае, если значения в нужном поле совпадают из левой
    - тоже как INNER JOIN, только не обязательно должен быть в правой таблице этот ID
    - в результате будут все из левой (покупатели), а значения заказов если их не было в правой, останется пустым
    - при этом если в правой есть еще другие id которых нет в левой, они не войдут
- RIGHT OUTER JOIN - аналогично левому, только наоборот получаем всех по правой таблице
    - если в правой есть, а в левой нет, тогда войдут все правые, а отсутствующие значения из левой будут NULL
- FULL OUTER JOIN
    - объединяет все данные из левой и правой таблицы, если не нашлись совпадения будет NULL

```
SELECT * FROM orders
INNER JOIN clients AS c ON c.id = orders.client_id
WHERE orders.date < '2020-05-01';

SELECT name, phone, email FROM clients
FULL OUTER JOIN orders ON orders.client_id = clients.id;

// получить еще поля из таблицы orders
SELECT name, orders.status, orders.date FROM clients
INNER JOIN orders ON orders.client_id = clients.id;

// в результат войдут все записи даже если ID client NULL
SELECT name, orders.status, orders.date FROM clients
RIGHT OUTER JOIN orders ON orders.client_id = clients.id

// тоже самое с Псевдонимами названия таблиц
SELECT name, o.status, o.date FROM clients AS c
RIGHT OUTER JOIN orders AS o ON o.client_id = c.id

// обьединение даже не по связанным полям
SELECT name, o.status, o.date FROM clients AS c
FULL OUTER JOIN orders AS o ON o.status = c.name
```

### Альтернативные варианты присоединения

- Извлекать поля из одной таблицы нужно в том же порядке, что и из другой. Число извлекаемых полей тоже должно
  совпадать.
- типы данных должны соответствовать друг другу
- UNION - удаляет дубликаты
- UNION ALL - оставляет все значения

```
SELECT name FROM clients AS c
UNION ALL
SELECT status FROM orders;
```

### Подзапросы в FROM

- запрос из запроса

```
SELECT AVG(ss.client_id)
FROM (SELECT * FROM orders ) AS ss;
```

### Подзапросы в WHERE

- условие из результата запроса

```
SELECT * 
FROM orders
WHERE client_id IN (SELECT client_id FROM orders );
```

