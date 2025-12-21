package com.app.woodshop.feature.order.mapper;

import com.app.woodshop.feature.order.dto.response.OrderResponse;
import com.app.woodshop.feature.order.entity.Order;
import com.app.woodshop.feature.order.entity.OrderDetail;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface OrderMapper {

    @Mapping(target = "userID", source = "user.userID")
    @Mapping(target = "items", source = "orderDetails", qualifiedByName = "mapOrderDetails")
    OrderResponse toOrderResponse(Order order);

    @Named("mapOrderDetails")
    default List<OrderResponse.OrderItemResponse> mapOrderDetails(List<OrderDetail> orderDetails) {
        if (orderDetails == null) return null;

        return orderDetails.stream().map(d ->
                OrderResponse.OrderItemResponse.builder()
                        .productID(d.getProduct().getProductID())
                        .quantity(d.getQuantity())
                        .price(d.getPrice())
                        .build()
        ).collect(Collectors.toList());
    }
}
