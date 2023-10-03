document.addEventListener("DOMContentLoaded", function () {
  const hotDogInput = document.getElementById("hotDogInput");
  const hotDogSauce = document.getElementById("hotDogSauce");
  const sausageInput = document.getElementById("sausageInput");
  const sausageSauce = document.getElementById("sausageSauce");
  const iceBiteInput = document.getElementById("iceBiteInput");
  const appleJuiceInput = document.getElementById("appleJuiceInput");
  const popcornInput = document.getElementById("popcornInput");
  const safariFruitFlakesInput = document.getElementById("safariFruitFlakesInput");
  const flingsInput = document.getElementById("flingsInput");
  const laysLightlySaltedInput = document.getElementById("laysLightlySaltedInput");
  const weekSelect = document.getElementById("weekSelect");
  const addToBasketBtn = document.getElementById("addToBasketBtn");
  const clearCartBtn = document.getElementById("clearCartBtn");
  const checkoutBtn = document.getElementById("checkoutBtn");
  const basketContents = document.getElementById("basketContents");
  const totalCost = document.getElementById("totalCost");

  // Tuckshop prices in ZAR
  const hotDogPrice = 25;
  const sausagePrice = 15;
  const iceBitePrice = 10;
  const appleJuicePrice = 12;
  const popcornPrice = 12;
  const safariFruitFlakesPrice = 10;
  const flingsPrice = 8;
  const laysLightlySaltedPrice = 10;

  // Order items
  const orderItems = [];

  // Week 1 to Week 8 prices
  const weekPrices = {
    week1: { amount: 0, order: '' },
    week2: { amount: 0, order: '' },
    week3: { amount: 0, order: '' },
    week4: { amount: 0, order: '' },
    week5: { amount: 0, order: '' },
    week6: { amount: 0, order: '' },
    week7: { amount: 0, order: '' },
    week8: { amount: 0, order: '' },
  };

  addToBasketBtn.addEventListener("click", function () {
    const selectedWeek = weekSelect.value;
    const hotDogQuantity = parseInt(hotDogInput.value);
    const hotDogSauceValue = hotDogSauce.value;
    const sausageQuantity = parseInt(sausageInput.value);
    const sausageSauceValue = sausageSauce.value;
    const iceBiteQuantity = parseInt(iceBiteInput.value);
    const appleJuiceQuantity = parseInt(appleJuiceInput.value);
    const popcornQuantity = parseInt(popcornInput.value);
    const safariFruitFlakesQuantity = parseInt(safariFruitFlakesInput.value);
    const flingsQuantity = parseInt(flingsInput.value);
    const laysLightlySaltedQuantity = parseInt(laysLightlySaltedInput.value);

    const itemPrices = {
      hotDog: { price: hotDogPrice, label: 'Hot Dog', sauce: hotDogSauceValue },
      sausage: {
        price: sausagePrice,
        label: 'Sausage Only',
        sauce: sausageSauceValue,
      },
      iceBite: { price: iceBitePrice, label: 'Ice Bite', sauce: null },
      appleJuice: { price: appleJuicePrice, label: 'Apple Juice', sauce: null },
      popcorn: { price: popcornPrice, label: 'Popcorn', sauce: null },
      safariFruitFlakes: {
        price: safariFruitFlakesPrice,
        label: 'Safari Fruit Flakes',
        sauce: null,
      },
      flings: { price: flingsPrice, label: 'Flings', sauce: null },
      laysLightlySalted: {
        price: laysLightlySaltedPrice,
        label: 'Lays Lightly Salted',
        sauce: null,
      },
    };

    const orderDetail = [];
    let orderSummary = '';
    if (hotDogQuantity > 0) {
      const price = itemPrices.hotDog.price * hotDogQuantity;
      orderDetail.push(
        `${hotDogQuantity} x ${itemPrices.hotDog.label} (${
          hotDogSauceValue !== 'none' ? hotDogSauceValue : 'No Sauce'
        }): ${price} ZAR`
      );
    }
    if (sausageQuantity > 0) {
      const price = itemPrices.sausage.price * sausageQuantity;
      orderDetail.push(
        `${sausageQuantity} x ${itemPrices.sausage.label} (${
          sausageSauceValue !== 'none' ? sausageSauceValue : 'No Sauce'
        }): ${price} ZAR`
      );
    }
    if (iceBiteQuantity > 0) {
      const price = itemPrices.iceBite.price * iceBiteQuantity;
      orderDetail.push(`${iceBiteQuantity} x ${itemPrices.iceBite.label}: ${price} ZAR`);
    }
    if (appleJuiceQuantity > 0) {
      const price = itemPrices.appleJuice.price * appleJuiceQuantity;
      orderDetail.push(`${appleJuiceQuantity} x ${itemPrices.appleJuice.label}: ${price} ZAR`);
    }
    if (popcornQuantity > 0) {
      const price = itemPrices.popcorn.price * popcornQuantity;
      orderDetail.push(`${popcornQuantity} x ${itemPrices.popcorn.label}: ${price} ZAR`);
    }
    if (safariFruitFlakesQuantity > 0) {
      const price = itemPrices.safariFruitFlakes.price * safariFruitFlakesQuantity;
      orderDetail.push(
        `${safariFruitFlakesQuantity} x ${itemPrices.safariFruitFlakes.label}: ${price} ZAR`
      );
    }
    if (flingsQuantity > 0) {
      const price = itemPrices.flings.price * flingsQuantity;
      orderDetail.push(`${flingsQuantity} x ${itemPrices.flings.label}: ${price} ZAR`);
    }
    if (laysLightlySaltedQuantity > 0) {
      const price = itemPrices.laysLightlySalted.price * laysLightlySaltedQuantity;
      orderDetail.push(
        `${laysLightlySaltedQuantity} x ${itemPrices.laysLightlySalted.label}: ${price} ZAR`
      );
    }

    if (orderDetail.length > 0) {
      const orderItemElement = document.createElement('p');
      orderItemElement.textContent = `${getWeekDate(
        selectedWeek
      )}:\n${orderDetail.join('\n')}`;
      basketContents.appendChild(orderItemElement);

      orderSummary = orderDetail.join(', ');

      const totalPrice =
        hotDogQuantity * itemPrices.hotDog.price +
        sausageQuantity * itemPrices.sausage.price +
        iceBiteQuantity * itemPrices.iceBite.price +
        appleJuiceQuantity * itemPrices.appleJuice.price +
        popcornQuantity * itemPrices.popcorn.price +
        safariFruitFlakesQuantity * itemPrices.safariFruitFlakes.price +
        flingsQuantity * itemPrices.flings.price +
        laysLightlySaltedQuantity * itemPrices.laysLightlySalted.price;

      weekPrices[selectedWeek].amount = totalPrice;
      weekPrices[selectedWeek].order = orderSummary;

      updateSubtotal();
    }

    // Reset form quantities
    hotDogInput.value = 0;
    hotDogSauce.value = 'none';
    sausageInput.value = 0;
    sausageSauce.value = 'none';
    iceBiteInput.value = 0;
    appleJuiceInput.value = 0;
    popcornInput.value = 0;
    safariFruitFlakesInput.value = 0;
    flingsInput.value = 0;
    laysLightlySaltedInput.value = 0;
  });

  clearCartBtn.addEventListener('click', function () {
    const confirmation = confirm('Are you sure you want to clear the cart?');
    if (confirmation) {
      basketContents.innerHTML = '';
      for (const week in weekPrices) {
        weekPrices[week] = { amount: 0, order: '' };
      }
      updateSubtotal();
    }
  });

  checkoutBtn.addEventListener('click', function () {
    const confirmation = confirm(
      "That's a yummy order! We just need to confirm your details before you complete the order (payment will take place on a secure website)."
    );
    if (confirmation) {
      const parentName = prompt('Please enter your full name and phone number:');
const childName = prompt("Please enter your child's name and class teacher:");

      if (parentName && childName) {
        const orderDetails = getOrderSummary();
        const totalAmount = calculateTotalAmount();

        const orderData = {
          Parent: parentName,
	  Child: childName,
          'Order Breakdown': orderDetails,
          Cost: `${totalAmount} ZAR`,
        };

        const orderConfirmation = `
          Parent's Name: ${parentName}
          Child's Details: ${childName}
          Order Details:
          ${orderDetails}
          Total Cost: ${totalAmount} ZAR
        `;
 const apiKey = 'UmaiF3c39grmhByWn4MPZVYfklm90CFWPZxRx8cfi3MZrYXEt98tK4Tp7wo';
        const sheetId = '1A2c5YPjGiMzbTco8MsCbNCHDimWycyrq1iVd1Pulyjg';
        const apiUrl = `https://api.sheetson.com/v2/sheets/TUCK`;

        fetch(apiUrl, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'X-Spreadsheet-Id': sheetId,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(orderData),
        })
        alert(orderConfirmation);

          const checkoutUrl = `https://pos.snapscan.io/qr/Bu-elYzb?id=tuckshop_${parentName}&amount=${totalAmount}00`;
          alert(`Pay with Snapscan now`);
        window.open(checkoutUrl, '_blank');
      } else {
        alert('Please fill out all the required information.');
      }
    }
  });

  function getOrderSummary() {
    const orderSummary = [];
    for (const week in weekPrices) {
      if (weekPrices[week].amount > 0) {
        orderSummary.push(
          `${getWeekDate(week)}:\n${weekPrices[week].order}\nTotal: ${weekPrices[week].amount} ZAR`
        );
      }
    }
    return orderSummary.join('\n\n');
  }

  function calculateTotalAmount() {
    let overallTotal = 0;
    for (const week in weekPrices) {
      overallTotal += weekPrices[week].amount;
    }
    return overallTotal;
  }

  function getWeekDate(week) {
    switch (week) {
      case 'week1':
        return 'Week 1 (13 October)';
      case 'week2':
        return 'Week 2 (20 October)';
      case 'week3':
        return 'Week 3 (27 October)';
      case 'week4':
        return 'Week 4 (03 November)';
      case 'week5':
        return 'Week 5 (10 November)';
      case 'week6':
        return 'Week 6 (17 November)';
      case 'week7':
        return 'Week 7 (24 November)';
      case 'week8':
        return 'Week 8 (1 December)';
      default:
        return 'Whole Term';
    }
  }

  function updateSubtotal() {
    let overallTotal = 0;
    for (const week in weekPrices) {
      overallTotal += weekPrices[week].amount;
    }

    totalCost.textContent = `Total Cost: ${overallTotal} ZAR`;
  }
});
