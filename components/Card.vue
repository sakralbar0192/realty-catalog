<template>
  <div :class="$style.card">
    <div :class="$style.card__header">
      <h3 :class="$style.card__title">
        <slot name="title" />
      </h3>
      <div :class="$style.card__actions">
        <slot name="actions" />
      </div>
    </div>
    
    <div :class="$style.card__content">
      <slot />
    </div>
    
    <div :class="$style.card__footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<style module lang="scss">
.card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  
  &__header {
    padding: 16px 20px;
    border-bottom: 1px solid #e1e5e9;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  &__title {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: #1a202c;
  }
  
  &__actions {
    display: flex;
    gap: 8px;
  }
  
  &__content {
    padding: 20px;
  }
  
  &__footer {
    padding: 16px 20px;
    background: #f7fafc;
    border-top: 1px solid #e1e5e9;
  }
}
</style>
