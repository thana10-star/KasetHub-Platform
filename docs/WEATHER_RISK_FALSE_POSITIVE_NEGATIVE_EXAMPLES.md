# Weather Risk False Positive / False Negative Examples

M79 adds local examples for each weather risk category.

False positives help catch cases where the app warns too strongly. False negatives help catch cases where the app misses a real-world risk.

## Example Boundaries

- A spraying risk warning may be too strong if the field is calm despite a windy forecast.
- A spraying risk warning may be too weak if localized rain arrives after a safe-looking forecast.
- A disease pressure warning may be too strong if humidity is high but there are no field symptoms.
- A disease pressure warning may be too weak if disease appears from local field conditions not represented by weather data.

These examples are not official agronomy rules. They are review fixtures for future expert validation.
