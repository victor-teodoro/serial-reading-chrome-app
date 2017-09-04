$( document ).ready(function() {
    let numOfBurgers = 0;
    let numOfSodas = 0;

    $("#inc-soda").click(incSoda);
    $("#dec-soda").click(decSoda);
    $("#inc-burger").click(incBurger);
    $("#dec-burger").click(decBurger);
    $("#show-bill").click(showBill);
    $("#bill-customer").click(billCustomer);

    // Incrementers and decrementers
    function incBurger() {
	++numOfBurgers;
	$("#num-of-burgers").val(numOfBurgers);
    }
    function decBurger() {
	--numOfBurgers;
	if(numOfBurgers < 0) numOfBurgers = 0;
	$("#num-of-burgers").val(numOfBurgers);
    }
    function incSoda() {
	++numOfSodas;
	$("#num-of-sodas").val(numOfSodas);
    }
    function decSoda() {
	--numOfSodas;
	if(numOfSodas < 0) numOfSodas = 0;
	$("#num-of-sodas").val(numOfSodas);
    }

    function showBill() {
	if($('#bill').css('display') === 'none')
	    $("#bill").show();
	else {
	    $("#bill").hide();
	    $('#customer-name').val("");
	    $('#bill-total').val("");	    
	}
    }   

    function billCustomer() {
	let order = {
	    "items": [
		{
		    "amount": 500,
		    "description": "Refrigerante (Copo)",
		    "quantity": 0
		},
		{
		    "amount": 2500,
		    "description": "Hamburger (160g)",
		    "quantity": 0
		}
	    ],
	    "customer": {
		"name": null,
		"email": null
	    },
	    "payments": [{
    		"payment_method": "credit_card",
    		"credit_card": {
    		    "card_id": null
    		}
	    }]
	};

	let sms = {};

	if($('#customer-name').val() === 'Victor Teodoro') {
	    order.items[0].quantity = $('#num-of-sodas').val();
	    order.items[1].quantity = $('#num-of-burgers').val();
	    order.customer_id = "cus_JVd6aELsw4iz6rpA";
	    order.customer.name = "Victor Teodoro";
	    order.customer.email = "vteodoro@stone.com.br";
	    order.payments[0].credit_card.card_id = "card_QdPjM9VI6VieWwr7";

	    sms.phonenumber = "5511985936125";
	    sms.msg = "Seu total eh de " + $('#bill-total').val(); 
	} else if($('#customer-name').val() === 'André Cavalcante') {
	    order.items[0].quantity = $('#num-of-sodas').val();
	    order.items[1].quantity = $('#num-of-burgers').val();
	    order.customer_id = "cus_o8z79b2Uvh39d1gN";
	    order.customer.name = "André Cavalcante";
	    order.customer.email = "acavalcante@stone.com.br";
	    order.payments[0].credit_card.card_id = "card_1yVB7ytPZcyVg8Mw";

	    sms.phonenumber = "5511981576479";
	    sms.msg = "Seu total eh de " + $('#bill-total').val();
	}

	console.log(order);
	console.log(sms);

	$.ajax({
	    type: "POST",
	    url: 'https://solutions-api.herokuapp.com/mundi_orders',
	    data: JSON.stringify(order),
	    contentType: "application/json; charset=utf-8",
	    dataType: 'json',
	    success: function (data) {
		console.log(data);
		$.post("https://findbin.herokuapp.com/sms", sms)
		    .done(function(data) {
			console.log(data);
		    });
	    }	   
	});
    }
});


