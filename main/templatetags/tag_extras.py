from django import template

register = template.Library()

@register.filter
def get(dictionary, key):
    return dictionary.get(key)

@register.filter(name='replace')
def replace(value, arg):
    """Custom template filter to replace characters in a string."""
    original_char, new_char = arg.split(',')
    return value.replace(original_char, new_char)

@register.filter(name='remove_spaces')
def remove_spaces(value):
    """Remove all spaces from the string."""
    return value.replace(' ', '')

@register.filter(name='remove_spaces_commas')
def remove_spaces_commas(value):
    """Removes all spaces and commas from the string."""
    return value.replace(' ', '').replace(',', '').replace('.', '')