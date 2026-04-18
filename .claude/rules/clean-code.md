# Clean Code JS Rules

## Variables
- **Meaningful Names**: Use names that reveal intent. No `data`, `item`, `list`.
- **Searchable Names**: Avoid magic numbers. Use constants.
- **Explanatory Variables**: Break down complex logic into variables.

## Functions
- **Small**: Functions should do one thing and do it well.
- **Limited Arguments**: Max 3 arguments. Use objects for more.
- **No Side Effects**: Functions should be pure whenever possible.

## SOLID Principles
- **Single Responsibility (SRP)**: A component/function has one reason to change.
- **Open/Closed**: Software entities should be open for extension but closed for modification.
- **Interface Segregation**: Don't force dependencies on methods they don't use.
- **Dependency Inversion**: Depend on abstractions, not concretions.
