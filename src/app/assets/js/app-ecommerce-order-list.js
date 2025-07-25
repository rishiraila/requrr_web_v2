/**
 * app-ecommerce-order-list Script
 */

'use strict';

// Datatable (jquery)

$(function () {
  let borderColor, bodyBg, headingColor;

  if (isDarkStyle) {
    borderColor = config.colors_dark.borderColor;
    bodyBg = config.colors_dark.bodyBg;
    headingColor = config.colors_dark.headingColor;
  } else {
    borderColor = config.colors.borderColor;
    bodyBg = config.colors.bodyBg;
    headingColor = config.colors.headingColor;
  }

  // Variable declaration for table

  var dt_order_table = $('.datatables-order'),
    statusObj = {
      1: { title: 'Dispatched', class: 'bg-label-warning' },
      2: { title: 'Delivered', class: 'bg-label-success' },
      3: { title: 'Out for Delivery', class: 'bg-label-primary' },
      4: { title: 'Ready to Pickup', class: 'bg-label-info' }
    },
    paymentObj = {
      1: { title: 'Paid', class: 'text-success' },
      2: { title: 'Pending', class: 'text-warning' },
      3: { title: 'Failed', class: 'text-danger' },
      4: { title: 'Cancelled', class: 'text-secondary' }
    };

  // E-commerce Products datatable

  if (dt_order_table.length) {
    var dt_products = dt_order_table.DataTable({
      ajax: assetsPath + 'json/ecommerce-customer-order.json', // JSON file to add data
      columns: [
        // columns according to JSON
        { data: 'id' },
        { data: 'id' },
        { data: 'order' },
        { data: 'date' },
        { data: 'customer' }, //email //avatar
        { data: 'payment' },
        { data: 'status' },
        { data: 'method' }, //method_number
        { data: '' }
      ],
      columnDefs: [
        {
          // For Responsive
          className: 'control',
          searchable: false,
          orderable: false,
          responsivePriority: 2,
          targets: 0,
          render: function (data, type, full, meta) {
            return '';
          }
        },
        {
          // For Checkboxes
          targets: 1,
          orderable: false,
          checkboxes: {
            selectAllRender: '<input type="checkbox" className="form-check-input">'
          },
          render: function () {
            return '<input type="checkbox" className="dt-checkboxes form-check-input" >';
          },
          searchable: false
        },
        {
          // Order ID
          targets: 2,
          render: function (data, type, full, meta) {
            var $order_id = full['order'];
            // Creates full output for row
            var $row_output = '<a href="app-ecommerce-order-details.html"><span>#' + $order_id + '</span></a>';
            return $row_output;
          }
        },
        {
          // Date and Time
          targets: 3,
          render: function (data, type, full, meta) {
            var date = new Date(full.date); // convert the date string to a Date object
            var timeX = full['time'].substring(0, 5);
            var formattedDate = date.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              time: 'numeric'
            });
            return '<span className="text-nowrap">' + formattedDate + ', ' + timeX + '</span>';
          }
        },
        {
          // Customers
          targets: 4,
          responsivePriority: 1,
          render: function (data, type, full, meta) {
            var $name = full['customer'],
              $email = full['email'],
              $avatar = full['avatar'];
            if ($avatar) {
              // For Avatar image
              var $output =
                '<img src="' + assetsPath + 'img/avatars/' + $avatar + '" alt="Avatar" className="rounded-circle">';
            } else {
              // For Avatar badge
              var stateNum = Math.floor(Math.random() * 6);
              var states = ['success', 'danger', 'warning', 'info', 'dark', 'primary', 'secondary'];
              var $state = states[stateNum],
                $name = full['customer'],
                $initials = $name.match(/\b\w/g) || [];
              $initials = (($initials.shift() || '') + ($initials.pop() || '')).toUpperCase();
              $output = '<span className="avatar-initial rounded-circle bg-label-' + $state + '">' + $initials + '</span>';
            }
            // Creates full output for row
            var $row_output =
              '<div className="d-flex justify-content-start align-items-center user-name">' +
              '<div className="avatar-wrapper me-3">' +
              '<div className="avatar avatar-sm">' +
              $output +
              '</div>' +
              '</div>' +
              '<div className="d-flex flex-column">' +
              '<a href="pages-profile-user.html" className="text-truncate text-heading">' +
              '<span className="fw-medium" > ' +
              $name +
              '</span></a>' +
              '<small className="text-truncate">' +
              $email +
              '</small>' +
              '</div>' +
              '</div>';
            return $row_output;
          }
        },
        {
          targets: 5,
          render: function (data, type, full, meta) {
            var $payment = full['payment'],
              $paymentObj = paymentObj[$payment];
            if ($paymentObj) {
              return (
                '<h6 className="mb-0 w-px-100 d-flex align-items-center ' +
                $paymentObj.class +
                '">' +
                '<i className="ri-circle-fill ri-10px me-1"></i>' +
                $paymentObj.title +
                '</h6>'
              );
            }
            return data;
          }
        },
        {
          // Status
          targets: -3,
          render: function (data, type, full, meta) {
            var $status = full['status'];

            return (
              '<span className="badge px-2 rounded-pill ' +
              statusObj[$status].class +
              '" text-capitalized>' +
              statusObj[$status].title +
              '</span>'
            );
          }
        },
        {
          // Payment Method
          targets: -2,
          render: function (data, type, full, meta) {
            var $method = full['method'];
            var $method_number = full['method_number'];

            if ($method == 'paypal') {
              $method_number = '@gmail.com';
            }
            return (
              '<div className="d-flex align-items-center text-nowrap">' +
              '<img src="' +
              assetsPath +
              'img/icons/payments/' +
              $method +
              '.png" alt="' +
              $method +
              '" className="me-2" width="29">' +
              '<span><i className="ri-more-line"></i>' +
              $method_number +
              '</span>' +
              '</div>'
            );
          }
        },
        {
          // Actions
          targets: -1,
          title: 'Actions',
          searchable: false,
          orderable: false,
          render: function (data, type, full, meta) {
            return (
              '<div>' +
              '<button className="btn btn-sm btn-icon btn-text-secondary waves-effect waves-light rounded-pill dropdown-toggle hide-arrow" data-bs-toggle="dropdown"><i className="ri-more-2-line ri-20px"></i></button>' +
              '<div className="dropdown-menu dropdown-menu-end m-0">' +
              '<a href="app-ecommerce-order-details.html" className="dropdown-item">View</a>' +
              '<a href="javascript:0;" className="dropdown-item delete-record">' +
              'Delete' +
              '</a>' +
              '</div>' +
              '</div>'
            );
          }
        }
      ],
      order: [3, 'asc'], //set any columns order asc/desc
      dom:
        '<"card-header d-flex flex-column flex-md-row align-items-start align-items-md-center pb-md-0 pt-0"<f><"d-flex align-items-md-center justify-content-md-end gap-4"l<"dt-action-buttons"B>>' +
        '>t' +
        '<"row mx-1"' +
        '<"col-sm-12 col-md-6"i>' +
        '<"col-sm-12 col-md-6"p>' +
        '>',
      lengthMenu: [10, 40, 60, 80, 100], //for length of menu
      language: {
        sLengthMenu: '_MENU_',
        search: '',
        searchPlaceholder: 'Search Order',
        info: 'Displaying _START_ to _END_ of _TOTAL_ entries'
      },
      // Buttons with Dropdown
      buttons: [
        {
          extend: 'collection',
          className: 'btn btn-outline-secondary dropdown-toggle waves-effect waves-light',
          text: '<i className="ri-upload-2-line ri-16px me-2"></i> <span className="d-none d-sm-inline-block">Export</span>',
          buttons: [
            {
              extend: 'print',
              text: '<i className="ri-printer-line me-1" ></i>Print',
              className: 'dropdown-item',
              exportOptions: {
                columns: [1, 2, 3, 4, 5],
                // prevent avatar to be print
                format: {
                  body: function (inner, coldex, rowdex) {
                    if (inner.length <= 0) return inner;
                    var el = $.parseHTML(inner);
                    var result = '';
                    $.each(el, function (index, item) {
                      if (item.classList !== undefined && item.classList.contains('user-name')) {
                        result = result + item.lastChild.firstChild.textContent;
                      } else if (item.innerText === undefined) {
                        result = result + item.textContent;
                      } else result = result + item.innerText;
                    });
                    return result;
                  }
                }
              },
              customize: function (win) {
                //customize print view for dark
                $(win.document.body)
                  .css('color', headingColor)
                  .css('border-color', borderColor)
                  .css('background-color', bodyBg);
                $(win.document.body)
                  .find('table')
                  .addClass('compact')
                  .css('color', 'inherit')
                  .css('border-color', 'inherit')
                  .css('background-color', 'inherit');
              }
            },
            {
              extend: 'csv',
              text: '<i className="ri-file-text-line me-1" ></i>Csv',
              className: 'dropdown-item',
              exportOptions: {
                columns: [1, 2, 3, 4, 5],
                // prevent avatar to be display
                format: {
                  body: function (inner, coldex, rowdex) {
                    if (inner.length <= 0) return inner;
                    var el = $.parseHTML(inner);
                    var result = '';
                    $.each(el, function (index, item) {
                      if (item.classList !== undefined && item.classList.contains('user-name')) {
                        result = result + item.lastChild.firstChild.textContent;
                      } else if (item.innerText === undefined) {
                        result = result + item.textContent;
                      } else result = result + item.innerText;
                    });
                    return result;
                  }
                }
              }
            },
            {
              extend: 'excel',
              text: '<i className="ri-file-excel-line me-1"></i>Excel',
              className: 'dropdown-item',
              exportOptions: {
                columns: [1, 2, 3, 4, 5],
                // prevent avatar to be display
                format: {
                  body: function (inner, coldex, rowdex) {
                    if (inner.length <= 0) return inner;
                    var el = $.parseHTML(inner);
                    var result = '';
                    $.each(el, function (index, item) {
                      if (item.classList !== undefined && item.classList.contains('user-name')) {
                        result = result + item.lastChild.firstChild.textContent;
                      } else if (item.innerText === undefined) {
                        result = result + item.textContent;
                      } else result = result + item.innerText;
                    });
                    return result;
                  }
                }
              }
            },
            {
              extend: 'pdf',
              text: '<i className="ri-file-pdf-line me-1"></i>Pdf',
              className: 'dropdown-item',
              exportOptions: {
                columns: [1, 2, 3, 4, 5],
                // prevent avatar to be display
                format: {
                  body: function (inner, coldex, rowdex) {
                    if (inner.length <= 0) return inner;
                    var el = $.parseHTML(inner);
                    var result = '';
                    $.each(el, function (index, item) {
                      if (item.classList !== undefined && item.classList.contains('user-name')) {
                        result = result + item.lastChild.firstChild.textContent;
                      } else if (item.innerText === undefined) {
                        result = result + item.textContent;
                      } else result = result + item.innerText;
                    });
                    return result;
                  }
                }
              }
            },
            {
              extend: 'copy',
              text: '<i className="ri-file-copy-line me-1"></i>Copy',
              className: 'dropdown-item',
              exportOptions: {
                columns: [1, 2, 3, 4, 5],
                // prevent avatar to be display
                format: {
                  body: function (inner, coldex, rowdex) {
                    if (inner.length <= 0) return inner;
                    var el = $.parseHTML(inner);
                    var result = '';
                    $.each(el, function (index, item) {
                      if (item.classList !== undefined && item.classList.contains('user-name')) {
                        result = result + item.lastChild.firstChild.textContent;
                      } else if (item.innerText === undefined) {
                        result = result + item.textContent;
                      } else result = result + item.innerText;
                    });
                    return result;
                  }
                }
              }
            }
          ]
        }
      ],
      // For responsive popup
      responsive: {
        details: {
          display: $.fn.dataTable.Responsive.display.modal({
            header: function (row) {
              var data = row.data();
              return 'Details of ' + data['customer'];
            }
          }),
          type: 'column',
          renderer: function (api, rowIdx, columns) {
            var data = $.map(columns, function (col, i) {
              return col.title !== '' // ? Do not show row in modal popup if title is blank (for check box)
                ? '<tr data-dt-row="' +
                    col.rowIndex +
                    '" data-dt-column="' +
                    col.columnIndex +
                    '">' +
                    '<td>' +
                    col.title +
                    ':' +
                    '</td> ' +
                    '<td>' +
                    col.data +
                    '</td>' +
                    '</tr>'
                : '';
            }).join('');

            return data ? $('<table className="table"/><tbody />').append(data) : false;
          }
        }
      }
    });
    $('.dt-action-buttons').addClass('pt-0');
  }

  // Delete Record
  $('.datatables-order tbody').on('click', '.delete-record', function () {
    dt_products.row($(this).parents('tr')).remove().draw();
  });

  // Filter form control to default size
  // ? setTimeout used for multilingual table initialization
  setTimeout(() => {
    $('.dataTables_filter .form-control').addClass('ms-0');
  }, 300);
});
