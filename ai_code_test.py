import logging

# Настройка логирования
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

class Calculator:
    def add(self, a: float, b: float) -> float:
        """Сложение двух чисел."""
        logging.info(f"Adding {a} and {b}")
        return a + b

    def subtract(self, a: float, b: float) -> float:
        """Вычитание двух чисел."""
        logging.info(f"Subtracting {b} from {a}")
        return a - b

    def multiply(self, a: float, b: float) -> float:
        """Умножение двух чисел."""
        logging.info(f"Multiplying {a} and {b}")
        return a * b

    def divide(self, a: float, b: float) -> float:
        """Деление двух чисел."""
        if b == 0:
            logging.error("Division by zero attempted")
            raise ZeroDivisionError("Cannot divide by zero")
        logging.info(f"Dividing {a} by {b}")
        return a / b

def get_number(prompt: str) -> float:
    """Получение числа от пользователя с валидацией."""
    while True:
        try:
            value = float(input(prompt))
            return value
        except ValueError:
            logging.warning("Invalid input. Please enter a number.")

def get_operation() -> str:
    """Получение операции от пользователя с валидацией."""
    operations = {'+', '-', '*', '/'}
    while True:
        operation = input("Enter operation (+, -, *, /): ")
        if operation in operations:
            return operation
        logging.warning("Invalid operation. Please enter one of +, -, *, /.")

def main():
    calculator = Calculator()
    while True:
        print("\nSimple Calculator")
        num1 = get_number("Enter first number: ")
        operation = get_operation()
        num2 = get_number("Enter second number: ")

        try:
            if operation == '+':
                result = calculator.add(num1, num2)
            elif operation == '-':
                result = calculator.subtract(num1, num2)
            elif operation == '*':
                result = calculator.multiply(num1, num2)
            elif operation == '/':
                result = calculator.divide(num1, num2)

            print(f"Result: {result}")
        except ZeroDivisionError as e:
            print(e)

        again = input("Do you want to perform another calculation? (y/n): ").strip().lower()
        if again != 'y':
            break

if __name__ == "__main__":
    main()