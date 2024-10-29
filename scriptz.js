$(document).ready(function () {
    let queueNumber = 1; 
    const maxQueueNumber = 100; 

    
    $('#numberSelection').addClass('hidden');
    $('#registrationForm').addClass('hidden');
    $('#result').addClass('hidden');
    $('#operatingHours').addClass('hidden');
    $('#downloadPDF').addClass('hidden'); 

    
    $('input[name="type"]').on('change', function () {
        const selectedType = $(this).val();
        $('#selectedServiceText').text(`Selected Service: ${selectedType.charAt(0).toUpperCase() + selectedType.slice(1)}`).fadeIn();
        $('.service-selection').fadeOut(); 
        $('#numberSelection').removeClass('hidden').hide().fadeIn(); 
    });

    
    $('#number').on('change', function () {
        if ($(this).val()) {
            const selectedNumber = $(this).val();
            $('#selectedNumberText').text(`Selected Number: ${selectedNumber}`).fadeIn(); 
            $('#registrationForm').removeClass('hidden').fadeIn(); 
            $('#numberSelection').fadeOut(); 
        }
    });

    $('#date').on('change', function () {
        const selectedDate = new Date($(this).val());
        const day = selectedDate.getUTCDay(); 
        if (day >= 1 && day <= 6) {
            $('#operatingHours').removeClass('hidden').fadeIn(); 
        } else {
            $('#operatingHours').addClass('hidden'); 
        }
    });

    function generateTicketPDF(data) {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");

        
        doc.text("Queue Ticket", 70, 20);
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");

        
        doc.setFontSize(20);
        doc.text(`Queue Number: ${data.queueNumber}`, 10, 40);
        doc.setLineWidth(0.5);
        doc.line(10, 42, 200, 42); 

        
        doc.setFontSize(12);
        doc.text(`Service: ${data.selectedService}`, 10, 55);
        doc.text(`Service Number: ${data.selectedNumber}`, 150, 55); 

        doc.setLineWidth(0.2);
        doc.line(10, 57, 200, 57); 

        
        doc.text("Personal Information", 10, 65);
        doc.setFontSize(10);
        doc.text(`Name: ${data.name}`, 10, 75);
        doc.text(`Student Number: ${data.studentNumber}`, 10, 85);
        doc.text(`Course: ${data.course}`, 10, 95);
        doc.text(`Year Level: ${data.yearLevel}`, 10, 105);
        doc.text(`Email: ${data.email}`, 10, 115);
        doc.text(`Phone: ${data.phone}`, 10, 125);

        
        doc.text(`Purpose: ${data.purpose}`, 10, 135);

        
        doc.text(`Date: ${data.date}`, 10, 145);
        doc.text("Operating Hours: 9 AM - 5 PM", 10, 155);

        
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.text("Please keep this ticket for your record.", 50, 175);

        
        doc.save("QueueTicket.pdf");
    }

    $('#registrationForm').on('submit', function (e) {
        e.preventDefault(); 

        if (queueNumber <= maxQueueNumber) {
            $('#queueNumber').text(queueNumber); 
            $('#qrcode').empty(); 

            
            const formData = `
                Name: ${$('#name').val()}
                Student Number: ${$('#studentNumber').val()}
                Course: ${$('#course').val()}
                Year Level: ${$('#yearLevel').val()}
                Email: ${$('#email').val()}
                Phone: ${$('#phone').val()}
                Date: ${$('#date').val()}
                Purpose: ${$('#purpose').val()}
                
            `;
            $('#qrcode').qrcode({
                width: 200,
                height: 200,
                text: formData
            });

            const formDetails = {
                queueNumber: queueNumber,
                selectedService: $('input[name="type"]:checked').val(),
                selectedNumber: $('#number').val(),
                name: $('#name').val(),
                studentNumber: $('#studentNumber').val(),
                course: $('#course').val(),
                yearLevel: $('#yearLevel').val(),
                email: $('#email').val(),
                phone: $('#phone').val(),
                date: $('#date').val(),
                purpose: $('#purpose').val(),
                
            };

            $('#qrcode').removeClass('hidden').fadeIn(); 
            $('#downloadPDF').removeClass('hidden').fadeIn(); 
            $('#result').removeClass('hidden').fadeIn(); 

            
            $('#formType').val(formDetails.selectedService);
            $('#formQueueNumber').val(queueNumber);

            
            $.ajax({
                type: "POST",
                url: $(this).attr('action'),
                data: $(this).serialize(),
                success: function () {
                    console.log("Form submitted successfully.");
                }
            });

            queueNumber++; 

            
            $('#registrationForm').fadeOut();
            $('#selectedServiceText').fadeOut();
            $('#selectedNumberText').fadeOut();
            $('#numberSelection').fadeOut();
            $('#operatingHours').fadeOut();

            
            $('#downloadPDF').data('details', formDetails);
        } else {
            alert('Queue number limit reached!');
        }
    });

    
    $('#downloadPDF').on('click', function () {
        const formDetails = $(this).data('details'); 
        if (formDetails) {
            generateTicketPDF(formDetails); 
        } else {
            alert("No form data available for PDF generation.");
        }
    });
});
